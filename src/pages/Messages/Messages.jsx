import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { apiSlice } from "../../features/api/apiSlice";
import {
  useCreateMessageMutation,
  useDeleteMessageMutation,
  useGetMessageQuery,
  useUpdateMessageMutation,
} from "../../features/messages/messagesApiSlice";
import styles from "./Messages.module.scss";
import Header from "../../components/Header/Header";
import MyInput from "../../components/MyInput/MyInput";
import Modal from "../../components/Modal/Modal";

import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "../../assets/icons/delete.svg";

const Messages = () => {
  const [searchItem, setSearchItem] = useState('');
  const [modalActive, setModalActive] = useState(false);
  const [editMessageId, setEditMessageId] = useState(null);
  const [selectedMessageType, setSelectedMessageType] = useState("");
  const [messageText, setMessageText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();
  const { data: messages, isLoading, error } = useGetMessageQuery();
  const [createMessage] = useCreateMessageMutation();
  const [updateMessage] = useUpdateMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  useEffect(() => {
    dispatch(apiSlice.endpoints.getMessage.initiate());
  }, [dispatch]);

  const handleAdd = () => {
    setIsEditing(false); // Сбрасываем флаг редактирования
    setEditMessageId(null); // Сбрасываем ID редактируемого сообщения
    setSelectedMessageType(""); // Сбрасываем выбранный тип сообщения
    setMessageText(""); // Сбрасываем текст сообщения
    setSelectedFiles([]); // Сбрасываем выбранные файлы
    setModalActive(true); // Открываем модальное окно
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("type", selectedMessageType);
    formData.append("message", messageText);
    selectedFiles.forEach((file) => formData.append("media", file));

    try {
      if (isEditing) {
        await updateMessage({ id: editMessageId, body: formData }).unwrap();
      } else {
        await createMessage(formData).unwrap();
      }
      // Очистка состояний после успешного создания/обновления сообщения
      setSelectedFiles([]);
      setSuccessMessage(
        isEditing ? "Сообщение успешно обновлено!" : "Сообщение успешно создано!"
      );
      setMessageText("");
      setIsEditing(false);
      setTimeout(() => {
        setModalActive(false);
        setSuccessMessage("");
      }, 1000);
    } catch (error) {
      console.error("Ошибка при создании/обновлении сообщения:", error);
    }
  };

  // Функция для открытия модального окна для редактирования сообщения
  const handleEdit = async (message) => {
    setEditMessageId(message.id);
    setSelectedMessageType(message.type);
    setMessageText(message.message);

    try {
      const fileObjects = await Promise.all(
        message.media.map(async (mediaItem) => {
          if (typeof mediaItem.media === "string") {
            const response = await fetch(mediaItem.media); // Изменено здесь
            if (!response.ok) {
              throw new Error(`Failed to fetch ${mediaItem.media}`);
            } 
            const blob = await response.blob();
            const fileName = mediaItem.media.split("/").pop();
            return new File([blob], fileName);
          } else {
            return mediaItem.media;
          }
        })
      );
      setSelectedFiles(fileObjects);
      setIsEditing(true);
      setModalActive(true);
    } catch (error) {
      console.error("Ошибка при загрузке файлов:", error);
    }
  };

  const handleRemove = (messageId) => {
    const result = window.confirm("Вы точно хотите удалить сообщение?");
    if (result) {
      deleteMessage({ id: messageId });
    }
  };

  const handleRemoveFile = (fileIndex) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== fileIndex)
    );
  };

  const handleSearch = (e) => {
    setSearchItem(e.target.value);
  };
  
  const filteredMessages = messages
  ? messages.filter((message) =>
      message.message.toLowerCase().includes(searchItem.toLowerCase())
    )
  : [];

  return (
    <>
    <Header />
    <div className={styles.container}>
      <div className={styles.content_wrapp}>
        <h1>Сообщения</h1>
        <div className={styles.search__addBtn}>
          <MyInput value={searchItem} onChange={handleSearch}/>
          <button className={styles.button} onClick={handleAdd}>
            Добавить
          </button>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : (
          messages &&
          filteredMessages.map((message) => (
            <div className={styles.content} key={message.id}>
              <div className={styles.message__wrapp}>
                <div className={styles.message}>
                  <p>{message.message}</p>
                  <div className={styles.media_wrapp}>
                    {message.media.map((mediaItem, index) => (
                      <div key={index}>
                        {mediaItem.media.endsWith(".jpg") ||
                        mediaItem.media.endsWith(".png") ||
                        mediaItem.media.endsWith(".jpeg") ? (
                          <img
                            className={styles.img}
                            src={mediaItem.media}
                            alt={`img-${index}`}
                          />
                        ) : mediaItem.media.endsWith(".svg") ||
                          mediaItem.media.endsWith(".pdf") ||
                          mediaItem.media.endsWith(".eps") ||
                          mediaItem.media.endsWith(".ai") ||
                          mediaItem.media.endsWith(".cdr") ? (
                          <div>Векторное изображение: {mediaItem.media}</div>
                        ) : mediaItem.media.endsWith(".gif") ||
                          mediaItem.media.endsWith(".raw") ||
                          mediaItem.media.endsWith(".tiff") ||
                          mediaItem.media.endsWith(".bmp") ||
                          mediaItem.media.endsWith(".psd") ? (
                          <div>Растровое изображение: {mediaItem.media}</div>
                        ) : mediaItem.media.endsWith(".mp4") ||
                          mediaItem.media.endsWith(".MP4") ||
                          mediaItem.media.endsWith(".avi") ||
                          mediaItem.media.endsWith(".mov") ||
                          mediaItem.media.endsWith(".wmv") ||
                          mediaItem.media.endsWith(".mkv") ? (
                          <video controls width="250">
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
                  <button
                    className={styles.button}
                    onClick={() => handleRemove(message.id)}
                  >
                    <DeleteIcon />
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => handleEdit(message)}
                  >
                    <EditIcon className={styles.icon} />
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
            required
            name="types"
            id="types-select"
            className={styles.select}
            value={selectedMessageType}
            onChange={(e) => setSelectedMessageType(e.target.value)}
          >
            <option value="">-----</option>
            <option value="task">Задачи</option>
            <option value="documents_list">Список документов</option>
            <option value="menu">Меню</option>
            <option value="company_missions">Миссии компании</option>
            <option value="company values">Ценности компании</option>
            <option value="office_address">Адресс офиса</option>
            <option value="about_office">Описание офиса</option>
            <option value="sky_lab">Скай лаб</option>
            <option value="events">Ивенты</option>
            <option value="rest">Отдых</option>
            <option value="sport">Спорт</option>
            <option value="knowledge">Знания</option>
            <option value="bbox">bbox</option>
            <option value="to_do_list">Список дел пользователя</option>
            <option value="internal_kitchen">Внутрення кухня</option>
            <option value="tradition">Традиция</option>
          </select>
        </div>
        <textarea
          required
          rows={10}
          className={styles.input}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <input
          type="file"
          multiple
          className={styles.inputFiles}
          accept=".jpg, .mp4, .MP4, .jpeg, .svg, .pdf, .eps, .ai, .cdr, .png, .gif, .raw, .tiff, .bmp, .psd, .avi, .mov, .wmv, .mkv"
          onChange={(e) => {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles((prevFiles) => [
              ...prevFiles,
              ...newFiles.filter((file) => file instanceof File),
            ]);
          }}
        />
        <div className={styles.selected_files}>
          <p>Выбранные файлы:</p>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>
                {file.name}
                <button type="button" onClick={() => handleRemoveFile(index)}>
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button className={styles.saveBtn}>
          {isEditing ? "Обновить" : "Создать"}
        </button>
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}
      </form>
    </Modal>
  </>
  );
};

export default Messages;
