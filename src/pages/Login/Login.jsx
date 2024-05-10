import React, { useEffect, useRef, useState } from 'react';


import { useDispatch } from 'react-redux';

import styles from './Login.module.scss';
import { useNavigate } from 'react-router-dom';

import {useLoginMutation} from '../../features/auth/authApiSlice';
import { setCredentials } from '../../features/auth/authSlice';
import { ROUTES } from '../../utils/routes';


const Login = () => {
  const userRef = useRef()
  const errRef = useRef()


  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [login, {isLoading}] = useLoginMutation()


  useEffect(() => {
    userRef.current.focus()
  },[])

  useEffect(() => {
    setErrMsg('')
  },[username, password])


  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const userData = await login({username, password}).unwrap()
      dispatch(setCredentials({...userData, username }))
      setUsername('')
      setPassword('')
      navigate(ROUTES.MESSAGES)
      console.log("Авторазация")
    }catch(err) {
      if (!err?.originalStatus) {
        // isLoading: true until timeout occurs
        setErrMsg('No Server Response');
      } else if (err.originalStatus === 400) {
          setErrMsg('Missing Username or Password');
      } else if (err.originalStatus === 401) {
          setErrMsg('Unauthorized');
      } else {
          setErrMsg('Login Failed');
      }
      if (errRef.current) {
        errRef.current.focus();
      }
    }
  }



  return isLoading ?<h1>Loadin...</h1> : (
    <div className={styles.Login}>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <form className={styles.Form} onSubmit={handleSubmit}>
        <input
          placeholder='Login'
          className={styles.Input} 
          type="text"      
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          ref={userRef}
          required  
        />
        <input
          required
          placeholder='Password'
          className={styles.Input} 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit' className={styles.loginBtn}>вход</button>
      </form>
    </div>
  )
}

export default Login;
