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
  const [dateTime, setDateTime] = useState(null);
  const [status, setStatus] = useState(true);
  const [editSurveyId, setEditSurveyId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const { data: surveys, isLoading, error } = useGetSurveysQuery();
  const [updateSurvey, {}] = useUpdateSurveysMutation();
  const [deleteSurvey, {}] = useDeleteSurveysMutation();
  const [createSurvey, {}] = useCreateSurveysMutation();

  console.log(surveys);

  useEffect(() => {
    dispatch(apiSlice.endpoints.getSurveys.initiate());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.surveys}</div>;
  }

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", descriptionText);
    formData.append("start_datetime", dateTime);
    formData.append("active", status);

    try {
      if (isEditing) {
        await updateSurvey({
          id: editSurveyId,
          name: name,
          description: descriptionText,
          active: status,
        });
      } else {
        await createSurvey(formData);
      }
      // Очистка состояний после успешного создания/обновления сообщения
      setSuccessSurvey(
        isEditing
          ? "Сообщение успешно обновлено!"
          : "Сообщение успешно создано!"
      );
      setName("");
      setIsEditing(false);
      setTimeout(() => {
        setModalActive(false);
        setSuccessSurvey("");
      }, 1000);
    } catch (error) {
      console.error("Ошибка при создании/обновлении сообщения:", error);
      console.log("Дополнительная информация об ошибке:", error.response.data);
    }
  };

  const handleAdd = () => {
    setIsEditing(false); // Сбрасываем флаг редактирования
    setEditSurveyId(null); // Сбрасываем ID редактируемого документа

    setName("");
    setDescriptionText("");
    setModalActive(true); // Открываем модальное окно
  };

  // const handleEdit = (survey) => {
  //   setEditSurveyId(survey.id);
  //   setName(survey.name);
  //   setDescriptionText(survey.description);
  //   setIsEditing(true);
  //   setModalActive(true);
  // };

  // const handleRemove = (survey, e) => {
  //   const result = window.confirm("Вы точно хотите удалить опрос?");
  //   if (result) {
  //     deleteSurvey({ id: survey });
  //   } else {
  //   }
  // };

  const handleSearch = (e) => {
    setSearchItem(e.target.value);
  };

  // Функция для фильтрации пользователей по имени и статусу
  const filteredSurveys = surveys.filter((survey) => {
    return (
      survey.name.toLowerCase().includes(searchItem.toLowerCase()) ||
      survey.description.toLowerCase().includes(searchItem.toLowerCase())
    );
  });
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
                  {/* <div className={styles.buttons}>
                    <button onClick={() => handleRemove(survey.id)}>
                        <DeleteIcon />
                      </button>
                      <button onClick={() => handleEdit(survey)}>
                        <EditIcon className={styles.icon} />
                      </button>
                  </div> */}
                  <NavLink
                    to={`${ROUTES.SURVEY}/${survey.id}`}
                    className={styles.links}
                  >
                    <p className={styles.name}>{survey.name}</p>
                  </NavLink>
                  <p>{survey.target_users}</p>
                  <p>{survey.start_datetime}</p>
                  <p>{survey.active === true ? "Активный" : "Неактивный"}</p>
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
            <select name="status" id="status">
              <option value="">-</option>
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
