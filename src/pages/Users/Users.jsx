import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import styles from './Users.module.scss';
import { useDispatch } from 'react-redux';
import {useGetUserQuery} from '../../features/users/usersApiSlice';
import MyInput from '../../components/MyInput/MyInput';
import { apiSlice } from '../../features/api/apiSlice';


const Users = () => {
  const [sortBy, setSortBy] = useState('-----'); 
  const [searchItem, setSearchItem] = useState(''); // Поисковый запрос

  const dispatch = useDispatch();

  const { data: users, isLoading, error } = useGetUserQuery();

  useEffect(() => {
    dispatch(apiSlice.endpoints.getUser.initiate());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.users}</div>;
  }

  console.log(users);

  const translation = {
    "start": "Сборка документов",
    "collect_docs": "Собрал(а) документы",
    "in_office": "Прибыл в офис"
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchItem(e.target.value);
  };

  // Функция для фильтрации пользователей по имени и статусу
  const filteredUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(searchItem.toLowerCase()) || 
           user.status.toLowerCase().includes(searchItem.toLowerCase());
  });

  // Функция для сортировки пользователей
  const sortedUsers = filteredUsers.slice().sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name); // Сортировка по имени
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status); // Сортировка по статусу
    }
    return 0;
  });

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h2>Список пользователей</h2>
          
          <div className={styles.users_list}>
            <div className={styles.search_box}>
              <div className={styles.Search__wrapp}>
                <MyInput value={searchItem} onChange={handleSearch} />
              </div>
              <div className={styles.sortSelector}>
                <select value={sortBy} onChange={handleSortChange}>
                  <option value="">-----</option>
                  <option value="name">по имени</option>
                  <option value="status">по статусу</option>
                </select>
              </div>
            </div>
            <div className={styles.data}>
              <p>Имя</p>
              <p>Статус</p>
              <p>Чат айди</p>
              <p>Ссылка</p>
            </div>
            {users && sortedUsers.map((user) => (
              <div className={styles.user} key={user.id}>
                <p className={styles.name}>{user.name}</p>
                <p>{translation[user.status]}</p>
                <p>{user.telegram_chat_id}</p>
                <a className={styles.link} href={user.telegram_profile_link} target='_blank'>{user.telegram_profile_link}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
