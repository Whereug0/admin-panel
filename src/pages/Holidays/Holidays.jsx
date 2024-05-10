import React from 'react';
import styles from './Holidays.module.scss';
import Header from '../../components/Header/Header'

const Holidays = () => {


  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Культура билайн</h1>  
        </div>
      </div>
    </>
  )
}

export default Holidays
