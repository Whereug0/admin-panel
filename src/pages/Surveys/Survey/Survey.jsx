import React, { useEffect, useState } from "react";
import styles from "./Survey.module.scss";
import Header from "../../../components/Header/Header";
import { useParams } from "react-router-dom";
import { useCreateSurveyIdQuestionsMutation, useGetSurveyIdOptionQuery, useGetSurveyIdQuestionsQuery, useGetSurveySingleQuery } from "../../../features/surveys/surveysApiSlice";
import { useDispatch } from "react-redux";
import { apiSlice } from "../../../features/api/apiSlice";
import MyInput from "../../../components/MyInput/MyInput";

const Survey = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: survey, isLoading, error } = useGetSurveySingleQuery(id);
  const { data: questions, isLoading: isLoadingQuestions, error: errorQuestions } = useGetSurveyIdQuestionsQuery(id);
  
  const [createQuestion, { isLoading: isCreating }] = useCreateSurveyIdQuestionsMutation();
  
  const [selectedStatus, setSelectedStatus] = useState('-');
  const [selectedTypes, setSelectedTypes] = useState({}); 
  const [options, setOptions] = useState({});

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

  const handleAddQuestion = async () => {
    try {
      await createQuestion({ id: id, question_type: selectedTypes, text: questions.text });
    } catch (e) {
      console.log("Не удалось создать вопрос", e);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          {survey && (
            <div className={styles.survey__wrapp} key={survey.id}>
              <div className={styles.input_wrapp}>
                <label htmlFor="title">Название:</label>
                <textarea id="title" className={styles.title} defaultValue={survey.name}></textarea>
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
            <button onClick={handleAddQuestion}>Добавить</button>
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
                    <label htmlFor={`options-${question.id}`}>Варианты ответов:</label>
                    {options[question.id] && options[question.id].map(option => (
                      <p key={option.id} id={`option-${option.id}`}>{option.text}</p>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Survey;
