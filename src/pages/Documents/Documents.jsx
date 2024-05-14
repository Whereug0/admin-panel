import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { apiSlice } from '../../features/api/apiSlice';
import { useDispatch } from 'react-redux';
import MyInput from '../../components/MyInput/MyInput';
import { useGetDocumentQuery, useCreateDocumentMutation, useUpdateDocumentMutation, useDeleteDocumentMutation } from '../../features/documents/documentsApiSlice';
import Modal from '../../components/Modal/Modal';

import {ReactComponent as EditIcon} from '../../assets/icons/edit.svg';
import {ReactComponent as DeleteIcon} from '../../assets/icons/delete.svg';

import styles from './Documents.module.scss';

const Documents = () => {
  const [searchItem, setSearchItem] = useState('');
  const [modalActive, setModalActive] = useState(false);
  const [name, setName] = useState('')
  const [instruction, setInstruction] = useState('')
  const [editDocumentId, setEditDocumentId] = useState(null);
  const [successDocument, setSuccessDocument] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();

  const { data: documents, isLoading, error } = useGetDocumentQuery();
  const [createDocument, {}] = useCreateDocumentMutation();
  const [updateDocument, {}] = useUpdateDocumentMutation();
  const [deleteDocument, {}] = useDeleteDocumentMutation();

  useEffect(() => {
    dispatch(apiSlice.endpoints.getDocument.initiate());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.documents}</div>;
  }

  console.log(documents);




  const handleSearch = (e) => {
    setSearchItem(e.target.value);
  };

  // Функция для фильтрации пользователей по имени и статусу
  const filteredDocuments = documents.filter((document) => {
    return document.name.toLowerCase().includes(searchItem.toLowerCase()) || 
           document.instruction.toLowerCase().includes(searchItem.toLowerCase());
  });

  // const handleCreate = async () => {
  //   const documentName = prompt("Введите название документа:");
  //   const instructionText = prompt("Введите инструкцию документа:");
  //   try {
  //     const result = await createDocument({name: documentName, instruction: instructionText }); 
  //     console.log("Сообщение успешно создано:", result.data);
  //   } catch (error) {
  //     console.error("Ошибка при создании сообщения:", error);
  //   }
  // }

  // const handleUpdate = (holiday) => {
  //   const documentName = prompt("Введите название документа:");
  //   const instructionText = prompt("Введите текст документа")
  //   updateDocument({id: holiday, name: documentName, instruction: instructionText})
  // }

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("instruction", instruction);

    try {
      if (isEditing) {
        const b = documents && Array.isArray(documents) && documents.map(document => document);
        console.log(b)
        await updateDocument({ id: editDocumentId, name: name, instruction: instruction });
      } else {
        await createDocument(formData);
      }
      // Очистка состояний после успешного создания/обновления сообщения
      setSuccessDocument(isEditing ? "Сообщение успешно обновлено!" : "Сообщение успешно создано!");
      setName('');
      setIsEditing(false);
      setTimeout(() => {
        setModalActive(false);
        setSuccessDocument('');
      }, 1000);
    } catch (error) {
      console.error("Ошибка при создании/обновлении сообщения:", error);
      console.log("Дополнительная информация об ошибке:", error.response.data);
    }
  };

  // Функция для открытия модального окна для редактирования сообщения

  
  const handleAdd = () => {
    setIsEditing(false); // Сбрасываем флаг редактирования
    setEditDocumentId(null); // Сбрасываем ID редактируемого документа
    // Устанавливаем начальные значения пустыми только при добавлении нового документа
    setName('');
    setInstruction('');
    setModalActive(true); // Открываем модальное окно
  };

  const handleEdit = (document) => {
    setEditDocumentId(document.id);
    setName(document.name);
    setInstruction(document.instruction);
    setIsEditing(true);
    setModalActive(true);
  };

  const handleRemove = (holiday) => {
    const result = window.confirm('Вы точно хотите удалить сообщение?');
    if(result) {
      deleteDocument({id: holiday})
    }else {
    }
  }


  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h2>Список документов</h2>
          <div className={styles.documents_list}>
            <div className={styles.search_box}>
              <div className={styles.Search__wrapp}>
                <MyInput value={searchItem} onChange={handleSearch} />
                <button onClick={handleAdd}>Добавить</button>
              </div>
            </div>
            <div className={styles.data}>
              <p>Название</p>
              <p className={styles.instruction}>Инструкция</p>
            </div>
            {documents && filteredDocuments.map((document) => (
              <div className={styles.document} key={document.id}>
                <p className={styles.name}>{document.name}</p>
                <p className={styles.instruction}>{document.instruction}</p>
                <div className={styles.buttons}>
                  <button onClick={() => handleRemove(document.id)}>
                    <DeleteIcon />
                  </button>
                  <button onClick={() => handleEdit(document)}>
                    <EditIcon className={styles.icon}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal active={modalActive} setActive={setModalActive}>
        <form action="" className={styles.form} onSubmit={handleCreateOrUpdate}>
          <div className={styles.name__wrapp}>
            <label htmlFor="name">Введите название:</label>
            <input
                id='name'
                required
                rows={1}
                className={styles.inputName}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.instruction__wrapp}>
            <label htmlFor="instruction">Инструкция:</label>
            <textarea
              id='instruction'
              required
              rows={10}
              className={styles.input}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            />
          </div>
          <button className={styles.saveBtn}>{isEditing ? 'Обновить' : 'Создать'}</button>
          {successDocument && <div className={styles.successDocument}>{successDocument}</div>}
        </form>
      </Modal>
    </>
  );
}

export default Documents;
