import React from "react";
import './menu-bar.scss'

interface MenuBarProps {
  className: string;
  menus: any;
  menu: string;
  setMenu: (val: string) => void;
}

const MenuBarComponent: React.FC<MenuBarProps> = (
  {
    className,
    menus,
    menu,
    setMenu,
  }
) => {
  return (
    <ul className={`tab-menu ${className}`}>
      { Object.keys(menus).map((m) => (
        <li
          className={`${menu === menus[m] && 'on'}`}
          onClick={() => setMenu(menus[m])}
        >{ menus[m] }</li>
      ))}
    </ul>
  );
}

export default MenuBarComponent;
