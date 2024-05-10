import React, { useState } from "react";
import styles from "./Header.module.scss";
import BurgerIcon from "../Burger-icon/BurgerIcon";
import MyInput from "../MyInput/MyInput";

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
      <MyInput />
    </header>
  );
};

export default Header;
