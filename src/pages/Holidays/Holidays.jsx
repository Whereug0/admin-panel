import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import { useDispatch } from "react-redux";
import {
  useCreateHolidayMutation,
  useDeleteHolidaysMutation,
  useGetHolidayQuery,
  useUpdateHolidaysMutation,
} from "../../features/holidays/holidaysApiSlice";
import { apiSlice } from "../../features/api/apiSlice";
import MyInput from "../../components/MyInput/MyInput";
import Modal from "../../components/Modal/Modal";

import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "../../assets/icons/delete.svg";
import styles from "./Holidays.module.scss";

const Holidays = () => {
  const dispatch = useDispatch();

  const [searchItem, setSearchItem] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [editHolidayId, setEditHolidayId] = useState(null);
  const [holidayText, setHolidayText] = useState("");
  const [successHoliday, setSuccessHoliday] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [titleHoliday, setTitleHoliday] = useState("");

  const { data: holidays, isLoading, error } = useGetHolidayQuery();
  const [createHoliday] = useCreateHolidayMutation();
  const [updateHoliday] = useUpdateHolidaysMutation();
  const [deleteHoliday] = useDeleteHolidaysMutation();

  useEffect(() => {
    dispatch(apiSlice.endpoints.getHoliday.initiate());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleAdd = () => {
    setIsEditing(false); // Сбрасываем флаг редактирования
    setEditHolidayId(null); // Сбрасываем ID редактируемого сообщения
    setHolidayText(""); // Сбрасываем текст сообщения
    setSelectedFiles([]); // Сбрасываем выбранные файлы
    setModalActive(true); // Открываем модальное окно
    setTitleHoliday("");
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", titleHoliday);
    formData.append("text", holidayText);
    selectedFiles.forEach((file) => formData.append("media", file));

    try {
      if (isEditing) {
        await updateHoliday({ id: editHolidayId, body: formData }).unwrap();
      } else {
        await createHoliday(formData).unwrap();
      }
      // Очистка состояний после успешного создания/обновления сообщения
      setSelectedFiles([]);
      setSuccessHoliday(
        isEditing
          ? "Сообщение успешно обновлено!"
          : "Сообщение успешно создано!"
      );
      setHolidayText("");
      setIsEditing(false);
      setTimeout(() => {
        setModalActive(false);
        setSuccessHoliday("");
      }, 1000);
    } catch (error) {
      console.error("Ошибка при создании/обновлении сообщения:", error);
    }
  };

  const handleEdit = async (holiday) => {
    setEditHolidayId(holiday.id);
    setTitleHoliday(holiday.name);
    setHolidayText(holiday.text);

    try {
      const fileObjects = await Promise.all(
        holiday.media.map(async (mediaItem) => {
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

  const handleRemove = (holidayId) => {
    const result = window.confirm("Вы точно хотите удалить сообщение?");
    if (result) {
      deleteHoliday({ id: holidayId });
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
  
  const filteredHolidays = holidays
  ? holidays.filter((holiday) =>
      holiday.text.toLowerCase().includes(searchItem.toLowerCase()) ||
      holiday.name.toLowerCase().includes(searchItem.toLowerCase())
    )
  : [];

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content_wrapp}>
          <h1>Культуры Beeline</h1>
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
            holidays &&
            filteredHolidays.map((holiday) => (
              <div className={styles.content} key={holiday.id}>
                <div className={styles.holiday__wrapp}>
                  <div className={styles.holiday}>
                    <h4>Заголовок: {holiday.name}</h4>
                    <p>{holiday.text}</p>
                    <div className={styles.media_wrapp}>
                      {holiday.media.map((mediaItem, index) => (
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
                      onClick={() => handleRemove(holiday.id)}
                    >
                      <DeleteIcon />
                    </button>
                    <button
                      className={styles.button}
                      onClick={() => handleEdit(holiday)}
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
          <label htmlFor="title">Введите заголовок:</label>
          <input
            id="title"
            type="text"
            className={styles.title}
            value={titleHoliday}
            onChange={(e) => setTitleHoliday(e.target.value)}
          />
          <textarea
            required
            rows={10}
            className={styles.input}
            value={holidayText}
            onChange={(e) => setHolidayText(e.target.value)}
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
          {successHoliday && (
            <div className={styles.successHoliday}>{successHoliday}</div>
          )}
        </form>
      </Modal>
    </>
  );
};

export default Holidays;
