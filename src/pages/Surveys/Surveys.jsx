import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import {
  useCreateSurveysMutation,
  useDeleteSurveysMutation,
  useGetSurveysQuery,
  useUpdateSurveysMutation,
} from "../../features/surveys/surveysApiSlice";
import MyInput from "../../components/MyInput/MyInput";
import Modal from "../../components/Modal/Modal";


import styles from "./Surveys.module.scss";
import { useDispatch } from "react-redux";
import { apiSlice } from "../../features/api/apiSlice";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../utils/routes";

const Surveys = () => {
  const dispatch = useDispatch();

  const [searchItem, setSearchItem] = useState("");
  const [modalActive, setModalActive] = useState(false);
  const [descriptionText, setDescriptionText] = useState("");
  const [successSurvey, setSuccessSurvey] = useState("");
  const [name, setName] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [status, setStatus] = useState(true);
  const [editSurveyId, setEditSurveyId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: surveys, isLoading, error } = useGetSurveysQuery();
  const [updateSurvey] = useUpdateSurveysMutation();
  const [deleteSurvey] = useDeleteSurveysMutation();
  const [createSurvey] = useCreateSurveysMutation();

  useEffect(() => {
    dispatch(apiSlice.endpoints.getSurveys.initiate());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const formattedDateTime = formatDateTime(dateTime);
    const formData = {
      name,
      description: descriptionText,
      start_datetime: formattedDateTime,
      active: status,
    };

    try {
      if (isEditing) {
        await updateSurvey({ id: editSurveyId, ...formData });
      } else {
        await createSurvey(formData);
      }
      setSuccessSurvey(
        isEditing ? "Опрос успешно обновлен!" : "Опрос успешно создан!"
      );
      setName("");
      setDescriptionText("");
      setDateTime("");
      setStatus(true);
      setIsEditing(false);
      setTimeout(() => {
        setModalActive(false);
        setSuccessSurvey("");
      }, 1000);
    } catch (error) {
      console.error("Ошибка при создании/обновлении опроса:", error);
    }
  };

  const handleAdd = () => {
    setIsEditing(false);
    setEditSurveyId(null);
    setName("");
    setDescriptionText("");
    setDateTime("");
    setStatus(true);
    setModalActive(true);
  };

  const handleSearch = (e) => {
    setSearchItem(e.target.value);
  };

  const filteredSurveys = surveys.filter((survey) =>
    survey.name.toLowerCase().includes(searchItem.toLowerCase()) ||
    survey.description.toLowerCase().includes(searchItem.toLowerCase())
  );

  const formatDateTime = (dateTime) => {
    const [date, time] = dateTime.split(' ');
    const [day, month, year] = date.split('.');
    const formattedDate = `${year}-${month}-${day}`;
    const timeZoneOffset = new Date().getTimezoneOffset();
    const offsetSign = timeZoneOffset > 0 ? '-' : '+';
    const offsetHours = String(Math.abs(Math.floor(timeZoneOffset / 60))).padStart(2, '0');
    const offsetMinutes = String(Math.abs(timeZoneOffset % 60)).padStart(2, '0');
    const formattedTimeZoneOffset = `${offsetSign}${offsetHours}:${offsetMinutes}`;
    return `${formattedDate}T${time}${formattedTimeZoneOffset}`;
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h2>Опросники</h2>
          <div className={styles.surveys_list}>
            <div className={styles.search_box}>
              <div className={styles.Search__wrapp}>
                <MyInput value={searchItem} onChange={handleSearch} />
                <button onClick={handleAdd}>Добавить</button>
              </div>
            </div>
            <div className={styles.data}>
              <p>Название</p>
              <p>Кол-во участников</p>
              <p>Дата создания</p>
              <p>Статус</p>
            </div>
            {surveys &&
              filteredSurveys.map((survey) => (
                <div className={styles.survey} key={survey.id}>
                  <NavLink
                    to={`${ROUTES.SURVEY}/${survey.id}`}
                    className={styles.links}
                  >
                    <p className={styles.name}>{survey.name}</p>
                  </NavLink>
                  <p>{survey.target_users}</p>
                  <p>{survey.start_datetime}</p>
                  <p>{survey.active ? "Активный" : "Неактивный"}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
      <Modal active={modalActive} setActive={setModalActive}>
        <form action="" className={styles.form} onSubmit={handleCreateOrUpdate}>
          <div className={styles.name__wrapp}>
            <label htmlFor="name">Название:</label>
            <input
              id="name"
              required
              rows={1}
              className={styles.inputName}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.name__wrapp}>
            <label htmlFor="date">Дата:</label>
            <input
              id="date"
              type="text"
              value={dateTime}
              className={styles.inputName}
              required
              onChange={(e) => setDateTime(e.target.value)}
            />
          </div>
          <div className={styles.name__wrapp}>
            <label htmlFor="status">Статус:</label>
            <select
              name="status"
              id="status"
              value={status ? "true" : "false"}
              onChange={(e) => setStatus(e.target.value === "true")}
            >
              <option value="true">Активный</option>
              <option value="false">Неактивный</option>
            </select>
          </div>
          <div className={styles.description__wrapp}>
            <label htmlFor="description">Описание:</label>
            <textarea
              id="description"
              required
              rows={10}
              className={styles.input}
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
            />
          </div>
          <button className={styles.saveBtn}>
            {isEditing ? "Обновить" : "Создать"}
          </button>
          {successSurvey && (
            <div className={styles.successSurvey}>{successSurvey}</div>
          )}
        </form>
      </Modal>
    </>
  );
};

export default Surveys;
