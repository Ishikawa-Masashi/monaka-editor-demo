import React, { FunctionComponent } from 'react';
import { css } from '../../../../utilities';

import './menu-item.scss';

type Props = {
  textLabel: string;
  selected?: boolean;
};

export const MenuItem: FunctionComponent<Props> = (props) => {
  const { textLabel, selected = false } = props;

  const menuItemClassName = css('menu-item', { selected: selected });

  console.log('class name:' + menuItemClassName);
  return (
    <div className={'menu-item-container'}>
      <div className={menuItemClassName}>{textLabel}</div>
    </div>
  );
};
