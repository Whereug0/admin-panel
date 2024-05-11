import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { ROUTES } from "../../utils/routes";

import {ReactComponent as DocumentIcon} from '../../assets/icons/reference-icon.svg';
import {ReactComponent as LogoutIcon} from '../../assets/icons/logout.svg';
import {ReactComponent as HolidayIcon} from '../../assets/icons/holiday-Icon.svg';
import {ReactComponent as UserIcon} from '../../assets/icons/user.svg';
import {ReactComponent as MessageIcon} from '../../assets/icons/message-icon.svg';

import styles from "./BurgerMenu.module.scss";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";


const BurgerMenu = (props) => {
  const { isActiveBurgerMenu, setIsActiveBurgerMenu } = props;
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const navMenuClasses = clsx(styles["nav-menu"], {
    [styles["nav-menu-active"]]: isActiveBurgerMenu,
  });


  const handleQuitBurgerMenu = () => {
    setIsActiveBurgerMenu(!isActiveBurgerMenu);
  };

  const handleLogout = () => {
    // Отправить действие logout в Redux
    dispatch(logout());

    // Перенаправить пользователя на страницу входа
    navigate(ROUTES.LOGIN);
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
              <HolidayIcon className={styles.icon}/>
              <span className={styles["nav-menu__text"]}>Культуры Beeline</span>
            </NavLink>
          </li>
          <li
            // onClick={handleQuitBurgerMenu}
            className={styles["nav-menu__item"]}
          >
            <NavLink className={styles["nav-menu__link"]} to={ROUTES.USERS}>
              <UserIcon className={styles.icon}/>
              <span className={styles["nav-menu__text"]}>Пользователи</span>
            </NavLink>
          </li>
          <li
            // onClick={handleQuitBurgerMenu}
            className={styles["nav-menu__item"]}
          >
            <NavLink className={styles["nav-menu__link"]} to={ROUTES.MESSAGES}>
              <MessageIcon className={styles.icon}/>
              <span className={styles["nav-menu__text"]}>Сообщения</span>
            </NavLink>
          </li>
          <li
            // onClick={handleQuitBurgerMenu}
            className={styles["nav-menu__item"]}
          >
            <NavLink className={styles["nav-menu__link"]} to={ROUTES.DOCUMENTS}>
              <DocumentIcon className={styles.icon}/>
              <span className={styles["nav-menu__text"]}>Документы</span>
            </NavLink>
          </li>
          
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogoutIcon className={styles.icon}/>
          Logout
        </button>
      </ul>
    </nav>
  );
};

export default BurgerMenu;
