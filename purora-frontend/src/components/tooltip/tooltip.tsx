import React from 'react';
import './tooltip.scss';

interface IProp {
  direction?: string;
}

const ToolTip: React.FC<IProp> = (
  {
    direction = 'top',
    children,
  }
) => {
  return (
    <div className="tooltip p-2">
      { children }
    </div>
  );
}

export default ToolTip;