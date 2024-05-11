import React from 'react'
import styles from './Modal.module.scss'


const Modal = ({ active, setActive, children }) => {
  return (
    <div className={`${styles.modal} ${active ? styles.modal__active : ''}`} onClick={() => setActive(false)}>
      <div className={`${styles.modal__content} ${active ? styles.modal__content__active : ''}`} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default Modal
