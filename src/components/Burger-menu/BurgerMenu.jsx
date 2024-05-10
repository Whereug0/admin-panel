import React from "react";


import { NavLink } from "react-router-dom";
import styles from "./BurgerMenu.module.scss";
import clsx from "clsx";
import { ROUTES } from "../../utils/routes";


const BurgerMenu = (props) => {
  const { isActiveBurgerMenu, setIsActiveBurgerMenu } = props;
  


  const navMenuClasses = clsx(styles["nav-menu"], {
    [styles["nav-menu-active"]]: isActiveBurgerMenu,
  });


  const handleQuitBurgerMenu = () => {
    setIsActiveBurgerMenu(!isActiveBurgerMenu);
  };

  return (
    <nav className={navMenuClasses}>
      <ul className={styles["nav-menu__list"]} onClick={(e) => e.stopPropagation()}>
        <div className={styles["pages"]}>
          <li
            // onClick={handleQuitBurgerMenu}
            className={styles["nav-menu__item"]}
          >
            <NavLink className={styles["nav-menu__link"]} to={ROUTES.HOLIDAYS}>

              <span className={styles["nav-menu__text"]}>Культуры Beeline</span>
            </NavLink>
          </li>
          <li
            // onClick={handleQuitBurgerMenu}
            className={styles["nav-menu__item"]}
          >
            <NavLink className={styles["nav-menu__link"]} to={ROUTES.USERS}>
 
              <span className={styles["nav-menu__text"]}>Сотрудники</span>
            </NavLink>
          </li>
          <li
            // onClick={handleQuitBurgerMenu}
            className={styles["nav-menu__item"]}
          >
            <NavLink className={styles["nav-menu__link"]} to={ROUTES.MESSAGES}>
 
              <span className={styles["nav-menu__text"]}>Сообщения</span>
            </NavLink>
          </li>
          <li
            // onClick={handleQuitBurgerMenu}
            className={styles["nav-menu__item"]}
          >
            <NavLink className={styles["nav-menu__link"]} to={ROUTES.REFERENCES}>
  
              <span className={styles["nav-menu__text"]}>Справки</span>
            </NavLink>
          </li>
          
        </div>

        <button className={styles.logoutBtn}>Logout</button>
      </ul>
    </nav>
  );
};

export default BurgerMenu;
