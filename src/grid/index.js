import {PropTypes} from 'react';

import style from './style.scss';
import {SCREEN_SIZES} from '../util/constants';
import joinObjects from '../util/join-objects';
import createHigherOrderComponent from '../util/create-higher-order-component';

const rowClassNameToPropMapping = {
  collapse: {
    basePropName: 'Collapse',
    isNumber: false
  },
  uncollapse: {
    basePropName: 'Uncollapse',
    isNumber: false
  },
  up: {
    basePropName: 'Up',
    isNumber: true
  }
};
const columnClassNameToPropMapping = {
  '': {
    basePropName: '',
    isNumber: true
  },
  offset: {
    basePropName: 'Offset',
    isNumber: true
  },
  centered: {
    basePropName: 'Centered',
    isNumber: false
  },
  uncentered: {
    basePropName: 'Uncentered',
    isNumber: false
  },
  push: {
    basePropName: 'Push',
    isNumber: true
  },
  pull: {
    basePropName: 'Pull',
    isNumber: true
  }
};
const rowPropTypes = {
  expanded: PropTypes.bool
};
const columnPropTypes = {
  end: PropTypes.bool
};

SCREEN_SIZES.forEach((size) => {
  Object.values(rowClassNameToPropMapping).forEach(({basePropName, isNumber}) =>
    rowPropTypes[`${size}${basePropName}`] = isNumber ? PropTypes.number : PropTypes.bool
  );

  Object.values(columnClassNameToPropMapping).forEach(({basePropName, isNumber}) =>
    columnPropTypes[`${size}${basePropName}`] = isNumber ? PropTypes.number : PropTypes.bool
  );
});

function getSizeClassNames(classNameToPropMapping, props) {
  const classNames = {};

  Object.keys(classNameToPropMapping).forEach((baseClassName) =>
    SCREEN_SIZES.forEach((size) => {
      const {basePropName, isNumber} = classNameToPropMapping[baseClassName];
      const propName = `${size}${basePropName}`;
      const propValue = props[propName];
      const className = size + (baseClassName ? `-${baseClassName}` : '');

      if (isNumber) {
        if (Number.isFinite(propValue) && propValue >= 0) {
          classNames[`${className}-${propValue}`] = true;
        }
      } else {
        classNames[className] = propValue;
      }
    })
  );

  return classNames;
}

export const Row = createHigherOrderComponent({
  displayName: 'Row',
  propTypes: rowPropTypes,
  mapPropsToClassNames: ({expanded, ...props}) => {
    const classNames = getSizeClassNames(rowClassNameToPropMapping, props);

    classNames.row = true;
    classNames.expanded = expanded;

    return joinObjects(style, classNames);
  },
  defaultComponentClass: 'div',
  collapseOnlyChild: false
});

export const Column = createHigherOrderComponent({
  displayName: 'Column',
  propTypes: columnPropTypes,
  mapPropsToClassNames: ({end, ...props}) => {
    const classNames = getSizeClassNames(columnClassNameToPropMapping, props);

    classNames.column = true;
    classNames.end = end;

    return joinObjects(style, classNames);
  },
  defaultComponentClass: 'div',
  collapseOnlyChild: false
});
