import React from 'react';
import Header from '../../components/Header/Header';
import styles from './Documents.module.scss';

const Documents = () => {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Документы</h1>        
        </div>
      </div>
    </>
  )
}

export default Documents;
