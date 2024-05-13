import React, { useState } from "react";
import styles from "./Header.module.scss";
import BurgerIcon from "../Burger-icon/BurgerIcon";
import MyInput from "../MyInput/MyInput";
import zIndex from "@mui/material/styles/zIndex";

const Header = () => {

  const [isActiveBurgerMenu, setIsActiveBurgerMenu] = useState(false);

  const handleShowBurgerMenu = () => {
    setIsActiveBurgerMenu(!isActiveBurgerMenu);
  };

  return (
    <header className={styles.header}>
      <BurgerIcon
        isActiveBurgerMenu={isActiveBurgerMenu}
        setIsActiveBurgerMenu={setIsActiveBurgerMenu}
        onClick={handleShowBurgerMenu}
      />
      <MyInput zIndex="-2"/>
    </header>
  );
};

export default Header;
