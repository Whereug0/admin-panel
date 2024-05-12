import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {apiSlice} from '../../features/api/apiSlice';
import { useCreateMessageMutation, useDeleteMessageMutation, useGetMessageQuery, useUpdateMessageMutation } from '../../features/messages/messagesApiSlice';
import styles from './Messages.module.scss';
import Header from '../../components/Header/Header';
import MyInput from '../../components/MyInput/MyInput';
import Modal from '../../components/Modal/Modal';

const Messages = () => {
  const [modalActive, setModalActive] = useState(false);
  const [editMessageId, setEditMessageId] = useState(null);
  const [selectedMessageType, setSelectedMessageType] = useState('');
  const [messageText, setMessageText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();
  const { data: messages, isLoading, error } = useGetMessageQuery();
  const [createMessage, {}] = useCreateMessageMutation();
  const [updateMessage, {}] = useUpdateMessageMutation();
  const [deleteMessage, {}] = useDeleteMessageMutation();

  useEffect(() => {
    dispatch(apiSlice.endpoints.getMessage.initiate());
  }, [dispatch]);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("type", selectedMessageType);
    formData.append("message", messageText);

    selectedFiles.forEach(file => {
      formData.append("media", file);
    });

    try {
      if (isEditing) {
        await updateMessage({ id: editMessageId, type: selectedMessageType, message: messageText });
      } else {
        await createMessage(formData);
      }
      // Очистка состояний после успешного создания/обновления сообщения
      setSelectedFiles([]);
      setSuccessMessage(isEditing ? "Сообщение успешно обновлено!" : "Сообщение успешно создано!");
      setMessageText('');
      setIsEditing(false);
      setTimeout(() => {
        setModalActive(false);
        setSuccessMessage('');
      }, 1000);
    } catch (error) {
      console.error("Ошибка при создании/обновлении сообщения:", error);
      console.log("Дополнительная информация об ошибке:", error.response.data);
    }
  };

  // Функция для открытия модального окна для редактирования сообщения
  const handleEdit = (message) => {
    setEditMessageId(message.id);
    setSelectedMessageType(message.type);
    setMessageText(message.message);
    setSelectedFiles(message.media.map(mediaItem => mediaItem.media));
    setIsEditing(true);
    setModalActive(true);
  };

  const handleRemove = (messageId) => {
    const result = window.confirm('Вы точно хотите удалить сообщение?');
    if (result) {
      deleteMessage({ id: messageId });
    }
  };

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
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error.message}</div>
          ) : (
            messages && messages.map((message) => (
              <div className={styles.content} key={message.id}>
                <div className={styles.message__wrapp}>
                  <div className={styles.message}>
                    <p>{message.message}</p>
                    <div className={styles.media_wrapp}>
                    {message.media.map((mediaItem, index) => (
                      <div key={index}>
                        {mediaItem.media.endsWith('.jpg') || mediaItem.media.endsWith('.jpeg') ? (
                          <img className={styles.img} src={mediaItem.media} alt={`img-${index}`} />
                        ) : mediaItem.media.endsWith('.svg') || mediaItem.media.endsWith('.pdf') || mediaItem.media.endsWith('.eps') || mediaItem.media.endsWith('.ai') || mediaItem.media.endsWith('.cdr') ? (
                          <div>Векторное изображение: {mediaItem.media}</div>
                        ) : mediaItem.media.endsWith('.png') || mediaItem.media.endsWith('.gif') || mediaItem.media.endsWith('.raw') || mediaItem.media.endsWith('.tiff') || mediaItem.media.endsWith('.bmp') || mediaItem.media.endsWith('.psd') ? (
                          <div>Растровое изображение: {mediaItem.media}</div>
                        ) : mediaItem.media.endsWith('.mp4') || mediaItem.media.endsWith('.MP4') || mediaItem.media.endsWith('.avi') || mediaItem.media.endsWith('.mov') || mediaItem.media.endsWith('.wmv') || mediaItem.media.endsWith('.mkv') ? (
                          <video controls width="250" key={index}>
                            <source src={mediaItem.media} type="video/mp4" />
                          </video>
                        ) : (
                          <div>{mediaItem.media}</div>
                        )}
                      </div>
                    ))}
                    </div>
                  </div>
                  <div className={styles.buttons}>
                    <button className={styles['button']} onClick={() => handleRemove(message.id)}>
                      Удалить
                    </button>
                    <button className={styles['button']} onClick={() => handleEdit(message)}>
                      Редактировать
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Modal active={modalActive} setActive={setModalActive}>
        <form action="" className={styles.form} onSubmit={handleCreateOrUpdate}>
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
              <option value="task">Задачи</option>
              <option value="documents_list">Список документов</option>
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
          <input 
            type='file'
            multiple
            accept='.jpg, .MP4'
            onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
          />
          <button className={styles.saveBtn}>{isEditing ? 'Обновить' : 'Создать'}</button>
          {successMessage && <div>{successMessage}</div>}
        </form>
      </Modal>
    </>
  );
};

export default Messages;




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