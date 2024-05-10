import React from 'react';
import Header from '../../components/Header/Header';
import styles from './References.module.scss';

const References = () => {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Справки</h1>        
        </div>
      </div>
    </>
  )
}

export default References
