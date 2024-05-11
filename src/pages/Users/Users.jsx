import React from 'react';
import Header from '../../components/Header/Header';
import styles from './Users.module.scss';

const Users = () => {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Пользователи</h1>      
        </div>
      </div>
    </>
  )
}

export default Users
