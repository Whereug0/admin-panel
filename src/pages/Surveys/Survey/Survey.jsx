import React, { useEffect, useState } from "react";
import styles from "./Survey.module.scss";
import Header from "../../../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateSurveyIdOptionsMutation, useCreateSurveyIdQuestionsMutation, useDeleteQuestionMutation, useDeleteSurveysMutation, useGetSurveyIdQuestionsQuery, useGetSurveySingleQuery } from "../../../features/surveys/surveysApiSlice";
import { useDispatch } from "react-redux";
import { apiSlice } from "../../../features/api/apiSlice";
import MyInput from "../../../components/MyInput/MyInput";
import { ROUTES } from "../../../utils/routes";
import Modal from "../../../components/Modal/Modal";


const Survey = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalActive, setModalActive] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [options, setOptions] = useState([]);
  const { data: survey, isLoading, error } = useGetSurveySingleQuery(id);
  const { data: questions, isLoading: isLoadingQuestions, error: errorQuestions } = useGetSurveyIdQuestionsQuery(id);
  const [createSurveyIdOptions, {}] = useCreateSurveyIdOptionsMutation()

  const [createQuestion, { isLoading: isCreating }] = useCreateSurveyIdQuestionsMutation();
  const [deleteSurvey] = useDeleteSurveysMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  const [selectedStatus, setSelectedStatus] = useState('-');
  const [selectedTypes, setSelectedTypes] = useState({}); 

  useEffect(() => {
    if (survey) {
      setSelectedStatus(survey.active ? 'active' : 'inactive');
    }
  }, [survey]);

  useEffect(() => {
    if (questions) {
      const initialTypes = questions.reduce((acc, question) => {
        acc[question.id] = question.question_type;
        return acc;
      }, {});
      setSelectedTypes(initialTypes);
      
      // Fetch options for each question
      questions.forEach((question) => {
        if (question.question_type === 'MULTIPLE_CHOICE') {
          fetchOptions(question.id);
        }
      });
    }
  }, [questions]);

  const fetchOptions = async (questionId) => {
    try {
      const result = await dispatch(apiSlice.endpoints.getSurveyIdOption.initiate(questionId));
      setOptions((prevOptions) => ({
        ...prevOptions,
        [questionId]: result.data
      }));
    } catch (error) {
      console.error("Failed to fetch options", error);
    }
  };

  const transition = {
    'MULTIPLE_CHOICE': 'Множественный выбор',
    'OPEN_ENDED': 'Открытый ответ'
  };

  if (isLoading || isLoadingQuestions || isCreating) return <div>Loading...</div>;
  if (error) return <div>Error loading survey: {error.message}</div>;
  if (errorQuestions) return <div>Error loading questions: {errorQuestions.message}</div>;

  const handleOpenModal = () => {
    setModalActive(true);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
        const questionData = {
            question_type: questionType,
            text: questionText,
        };

        // Создаем вопрос
        const questionResponse = await createQuestion(questionData).unwrap();
        const questionId = questionResponse.id;

        // Если вопрос типа MULTIPLE_CHOICE, создаем опции
        if (questionType === 'MULTIPLE_CHOICE' && options.length > 0) {
            const optionPromises = options.map(option => {
                const optionData = { questionId, text: option };
                return createSurveyIdOptions(optionData);
            });
            await Promise.all(optionPromises);
        }

        // Сброс формы и закрытие модального окна
        setModalActive(false);
        setQuestionText('');
        setQuestionType('');
        setOptions([]);
    } catch (e) {
        console.log("Не удалось создать вопрос", e);
    }
};

  const handleRemove = (surveyId) => {
    const result = window.confirm("Вы точно хотите удалить сообщение?");
    if (result) {
      deleteSurvey({ id: surveyId });
      navigate(ROUTES.SURVEYS);
    }
  };

  const handleRemoveQuestion = async (questionId) => {
    const result = window.confirm("Вы точно хотите удалить вопрос?");
    if (result) {
      try {
        await deleteQuestion(questionId);
      } catch (e) {
        console.log("Не удалось удалить вопрос", e);
      }
    }
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          {survey && (
            <div className={styles.survey__wrapp} key={survey.id}>
              <div className={`${styles.input_wrapp} ${styles.input_wrapp_title}`}>
                <div className={styles.title_input}>
                  <label htmlFor="title">Название:</label>
                  <textarea id="title" className={styles.title} defaultValue={survey.name}></textarea>
                </div>
                <div className={styles.buttons}>
                  <button onClick={() => handleRemove(survey.id)}>Удалить</button>
                  <button>Сохранить</button>
                </div>
              </div>
              <div className={styles.input_wrapp}>
                <label htmlFor="description">Описание:</label>
                <textarea id="description" rows={12} className={styles.description} defaultValue={survey.description}></textarea>
              </div>
              <p id="target_users">
                <label htmlFor="target_users">Количество участников: </label>
                {survey.target_users}
              </p>
              <div className={styles.input_wrapp}>
                <label htmlFor="data">Дата:</label>
                <textarea className={styles.data} id="data" defaultValue={survey.start_datetime}></textarea>
              </div>
              <div className={styles.select__wrapp}>
                <label htmlFor="status">Статус:</label>
                <select
                  name="status"
                  id="status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="active">Активный</option>
                  <option value="inactive">Неактивный</option>
                </select>
              </div>
            </div>
          )}
          <div className={styles.title_question}>
            <h3>Вопросы:</h3>
            <MyInput />
            <button onClick={handleOpenModal}>Добавить</button>
          </div>
          {questions && questions.map((question) => (
            <div key={question.id} className={styles.question}>
              <div className={styles.select__wrapp}>
                <label htmlFor={`type-${question.id}`}>Тип: </label>
                <select
                  id={`type-${question.id}`}
                  value={selectedTypes[question.id] || '-'}
                  onChange={(e) => setSelectedTypes({
                    ...selectedTypes,
                    [question.id]: e.target.value
                  })}
                >
                  <option value="-">-</option>
                  {Object.keys(transition).map((key) => (
                    <option key={key} value={key}>{transition[key]}</option>
                  ))}
                </select>
              </div>
              <div className={styles.question__wrapp}>
                <label htmlFor={`question-${question.id}`}>Вопрос:</label>
                <textarea id={`question-${question.id}`} rows={3} defaultValue={question.text}></textarea>
                {question.question_type === 'MULTIPLE_CHOICE' && (
                  <>
                    <label htmlFor={`options-${question.id}`}>Варианты ответов: <button>Добавить</button></label>
                    {options[question.id] && options[question.id].map(option => (
                      <textarea key={option.id} defaultValue={option.text}></textarea>
                    ))}
                  </>
                )}
                <div className={styles.buttons}>
                  <button onClick={() => handleRemoveQuestion(question.id)}>Удалить</button>
                  <button>Сохранить</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal active={modalActive} setActive={setModalActive}>
        <form className={styles.form} onSubmit={handleAddQuestion}>
          <div className={styles.select_wrapp}>
            <label htmlFor="types-select">Выберите тип:</label>
            <select
              required
              name="types"
              id="types-select"
              className={styles.select}
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            >
              <option value="">-----</option>
              <option value="MULTIPLE_CHOICE">Множественный выбор</option>
              <option value="OPEN_ENDED">Открытый ответ</option>
            </select>
          </div>
          <textarea
            required
            rows={10}
            className={styles.input}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          {questionType === 'MULTIPLE_CHOICE' && (
            <div className={styles.options}>
              <label>Опции:</label>
              {options.map((option, index) => (
                <div key={index} className={styles.option}>
                  <textarea
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  <button type="button" onClick={() => handleRemoveOption(index)}>Удалить</button>
                </div>
              ))}
              <button type="button" onClick={handleAddOption}>Добавить опцию</button>
            </div>
          )}
          <button className={styles.saveBtn}>
            Создать
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Survey;