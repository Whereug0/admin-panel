import React from 'react';
import styles from './MyInput.module.scss';
import {ReactComponent as SearchIcon} from '../../assets/icons/search.svg';

const MyInput = ({value, onChange, zIndex}) => {
  return (
    <div className={styles.input__wrapp} style={{ zIndex: zIndex }}>
      <div className={styles.input__box}>
        <SearchIcon className={styles.icon}/>
        <input value={value} onChange={onChange} className={styles.input} type="text" placeholder="Search"/>
      </div>
    </div>
  )
}

export default MyInput
