import React, { useEffect, useState } from 'react';
import styles from './Holidays.module.scss';
import Header from '../../components/Header/Header'
import { useDispatch } from 'react-redux';
import { useCreateHolidayMutation, useCreateMediaFileMutation, useDeleteHolidaysMutation, useGetHolidayQuery, useUpdateHolidaysMutation } from '../../features/holidays/holidaysApiSlice';
import { apiSlice } from '../../features/api/apiSlice';
import MyInput from '../../components/MyInput/MyInput';

const Holidays = () => {
  const dispatch = useDispatch();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const { data: holiday, isLoading, error } = useGetHolidayQuery();
  const [createHoliday] = useCreateHolidayMutation();
  const [updateHoliday] = useUpdateHolidaysMutation();
  const [deleteHoliday] = useDeleteHolidaysMutation();
  const [createMediaFile] = useCreateMediaFileMutation();

  useEffect(() => {
    dispatch(apiSlice.endpoints.getHoliday.initiate());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleCreateMediaFile = async () => {
    try {
      const formData = new FormData();
      Array.from(selectedFiles).forEach((file) => {
        formData.append('media', file);
      });
      const result = await createMediaFile(formData);
      console.log('Media file uploaded successfully:', result);
    } catch (error) {
      console.log('Ошибка при добавлении медиа', error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleCreate = async () => {
    const holidayName = prompt('Введите название сообщения:');
    const instructionText = prompt('Введите текст сообщения:');
    try {
      const result = await createHoliday({ name: holidayName, text: instructionText }).unwrap();
      console.log('Сообщение успешно создано:', result);
    } catch (error) {
      console.error('Ошибка при создании сообщения:', error);
    }
  };

  const handleRemove = async (holidayId) => {
    const result = window.confirm('Вы точно хотите удалить сообщение?');
    if (result) {
      try {
        await deleteHoliday({ id: holidayId }).unwrap();
        console.log('Сообщение успешно удалено');
      } catch (error) {
        console.error('Ошибка при удалении сообщения:', error);
      }
    }
  };

  const handleUpdate = async (holidayId) => {
    const holidayName = prompt('Введите название сообщения:');
    const instructionText = prompt('Введите текст сообщения');
    try {
      await updateHoliday({ id: holidayId, name: holidayName, text: instructionText, media: '' }).unwrap();
      console.log('Сообщение успешно обновлено');
    } catch (error) {
      console.error('Ошибка при обновлении сообщения:', error);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content_wrapp}>
          <h1>Культуры Beeline</h1>
          <div className={styles.search__addBtn}>
            <MyInput />
            <button className={styles.button} onClick={handleCreate}>
              Добавить
            </button>
          </div>
          {holiday &&
            holiday.map((holiday) => (
              <div className={styles.content} key={holiday.id}>
                <div className={styles.holiday__wrapp}>
                  <div className={styles.holiday}>
                    <h3 className={styles.holiday__name}>{holiday.name}</h3>
                    <p>{holiday.text}</p>
                    <div className={styles.media_wrapp}>
                      {holiday.media.map((mediaItem, index) =>
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
                      )}
                    </div>
                  </div>
                  <div className={styles.buttons}>
                    <button className={styles.button} onClick={() => handleRemove(holiday.id)}>
                      Удалить
                    </button>
                    <button className={styles.button} onClick={() => handleUpdate(holiday.id)}>
                      Редактировать
                    </button>
                    <input
                      type="file"
                      multiple
                      className={styles.inputFiles}
                      accept=".jpg, .mp4, .MP4, .jpeg, .svg, .pdf, .eps, .ai, .cdr, .png, .gif, .raw, .tiff, .bmp, .psd, .avi, .mov, .wmv, .mkv"
                      onChange={handleFileChange}
                    />
                    <button onClick={() => handleCreateMediaFile(holiday.id)}>Upload</button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Holidays;
