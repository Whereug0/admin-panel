import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {apiSlice} from '../../features/api/apiSlice';
import { useCreateMessageMutation, useDeleteMessageMutation, useGetMessageQuery, useUpdateMessageMutation } from '../../features/messages/messagesApiSlice';
import styles from './Messages.module.scss';
import Header from '../../components/Header/Header';
import MyInput from '../../components/MyInput/MyInput';
import Modal from '../../components/Modal/Modal';

const Messages = () => {
  const [modalActive, setModalActive] = useState(false)
  const [selectedMessageType, setSelectedMessageType] = useState('');
  const [messageText, setMessageText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const dispatch = useDispatch()
  const {data: message, isLoading, error} = useGetMessageQuery()
  const [createMessage, {}]  = useCreateMessageMutation()
  const [updateMessage, {}] = useUpdateMessageMutation()
  const [deleteMessage, {}] = useDeleteMessageMutation()

  useEffect(() => {
    dispatch(apiSlice.endpoints.getMessage.initiate())
  },[dispatch])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const result = await createMessage({ type: selectedMessageType, message: messageText }); 
      setSuccessMessage("Сообщение успешно создано!")
      setTimeout(() => {
        setModalActive(false);
        setSuccessMessage('');
      }, 1000);
    } catch (error) {
      console.error("Ошибка при создании сообщения:", error);
      console.log("Дополнительная информация об ошибке:", error.response.data);
    }
  }

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setModalActive(false);
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error:{error.message}</div>;
  }
  console.log(message)






  const handleRemove = (message) => {
    const result = window.confirm('Вы точно хотите удалить сообщение?');
    if(result) {
      deleteMessage({id: message})
    }else {
    }
  }

  const handleUpdate = (message) => {
    const messageType = prompt("Введите тип сообщения:");
    const messageText = prompt("Введите сообщение")
    updateMessage({id: message, type: messageType, message: messageText,})
  }


 

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content_wrapp}>
          <h1>Сообщения</h1>
          <div className={styles.search__addBtn}>
            <MyInput />
            <button className={styles['button']} onClick={() => setModalActive(true)}>
              Добавить
            </button>
          </div>
          {message && message.map((message) => (
            <div className={styles.content} key={message.id}>
              <div className={styles.message__wrapp}>
                <div className={styles.message}>
                  <p>
                    {message.message}
                  </p>
                  <div className={styles.media_wrapp}>
                  {message.media.map((mediaItem, index) => (
                    mediaItem.media.endsWith('.jpg') ? (
                      <img className={styles.img} src={mediaItem.media} alt={`img-${index}`} key={index} />
                    ) : (
                      mediaItem.media.endsWith('.MP4') && (
                        <video controls width="250" key={index}>
                          <source src={mediaItem.media} type="video/mp4" />
                        </video>
                      )
                    )
                  ))}
                  </div>
                </div>
                <div className={styles.buttons}>
                  <button className={styles['button']} onClick={() => handleRemove(message.id)}>
                    Удалить
                  </button>
                  <button className={styles['button']} onClick={() => handleUpdate(message.id)}>
                    Редактировать
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>

      </div>
      <Modal active={modalActive} setActive={setModalActive}>
        <form action="" className={styles.form} onSubmit={handleCreate}>
          <div className={styles.select_wrapp}>
            <label htmlFor="types-select">Выберите тип:</label>
            <select 
              name="types" 
              id="types-select" 
              className={styles.select}
              value={selectedMessageType}
              onChange={(e) => setSelectedMessageType(e.target.value)}
            >
              <option value="">-</option>
              <option value="task">
                Задачи
              </option>
              <option value="documents_list" >
                Список документов
              </option>
              <option value="menu">
                Меню
              </option>
              <option value="company_missions">
                Миссии компании
              </option>
              <option value="company values">
                Ценности компании
              </option>
              <option value="office_address">
                Адресс офиса
              </option>
              <option value="about_office">
                Описание офиса
              </option>
              <option value="sky_lab">
                Скай лаб
              </option>
              <option value="events">
                Ивенты
              </option>
              <option value="rest">
                Отдых
              </option>
              <option value="sport">
                Спорт
              </option>
              <option value="knowledge">
                Знания
              </option>
              <option value="bbox">
                bbox
              </option>
              <option value="to_do_list">
                Список дел пользователя
              </option>
              <option value="internal_kitchen">
                Внутрення кухня
              </option>
              <option value="tradition">
                Традиция
              </option>
            </select>
          </div>
          <textarea
              rows={10}
              className={styles.input}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
          />
          <button className={styles.saveBtn}>Создать</button>
          {successMessage && <div>{successMessage}</div>}
        </form>
      </ Modal>
    </>
  )
}

export default Messages




{/* const translation = {
  "task": "Задачи",
  "documents_list": "Список документов",
  "menu": "Меню",
  "company_missions": "Миссии компании",
  "company values": "Ценности компании",
  "office_address": "Адрес офиса",
  "about_office": "Описание офиса",
  "sky_lab": "Скай лаб",
  "events": "Ивенты",
  "rest": "Отдых",
  "sport": "Спорт",
  "knowledge": "Знания",
  "bbox": "bbox",
  "to_do_list": "Список дел пользователя",
  "internal_kitchen": "Внутрення кухня",
  "tradition": "Традиция",
}; */}