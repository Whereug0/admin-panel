import React from 'react';
import styles from './MyInput.module.scss';
import {ReactComponent as SearchIcon} from '../../assets/icons/search.svg';

const MyInput = () => {
  return (
    <div className={styles.input__wrapp}>
      <div className={styles.input__box}>
        <SearchIcon className={styles.icon}/>
        <input className={styles.input} type="text" placeholder="Search"/>
      </div>
    </div>
  )
}

export default MyInput
