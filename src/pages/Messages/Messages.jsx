import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {apiSlice} from '../../features/api/apiSlice';
import { useCreateMessageMutation, useDeleteMessageMutation, useGetMessageQuery, useUpdateMessageMutation } from '../../features/messages/messagesApiSlice';
import styles from './Messages.module.scss';
import Header from '../../components/Header/Header';
import MyInput from '../../components/MyInput/MyInput';

const Messages = () => {

  const dispatch = useDispatch()

  const {data: message, isLoading, error} = useGetMessageQuery()
  const [createMessage, {}]  = useCreateMessageMutation()
  const [updateMessage, {}] = useUpdateMessageMutation()
  const [deleteMessage, {}] = useDeleteMessageMutation()

  useEffect(() => {
    dispatch(apiSlice.endpoints.getMessage.initiate())
  },[dispatch])

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error:{error.message}</div>;
  }
  console.log(message)


  const handleCreate = async () => {
    const messageType = prompt("Введите тип сообщения:");
    const messageText = prompt("Введите текст сообщения:");
    try {
      const result = await createMessage({type: messageType, message: messageText }); 
      console.log("Сообщение успешно создано:", result.data);
    } catch (error) {
      console.error("Ошибка при создании сообщения:", error);
    }
  }

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
            <button className={styles['button']} onClick={handleCreate}>
              Добавить
            </button>
          </div>
          {message && message.map((message) => (
            <div className={styles.content} key={message.id}>
              <div className={styles.message__wrapp}>
                <div className={styles.message}>
                  <textarea className={styles.message__text}>
                    {message.message}
                  </textarea>
                  <div className={styles.media_wrapp}>
                  {message.media.map((mediaItem, index) => (
                    mediaItem.media.endsWith('.jpg') ? (
                      <img className={styles.img} src={mediaItem.media} alt={`img-${index}`} key={index} />
                    ) : (
                      mediaItem.media.endsWith('.MP4') && (
                        <video controls width="250" key={index}>
                          <source src={mediaItem.media} type="video/mp4" />
                          Ваш браузер не поддерживает видео.
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
    </>
  )
}

export default Messages

