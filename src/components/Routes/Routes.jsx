import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';
import Holidays from '../../pages/Holidays/Holidays';
import Users from '../../pages/Users/Users';
import Messages from '../../pages/Messages/Messages';
import References from '../../pages/References/References';
import Login from '../../pages/Login/Login';

const AppRoutes = () => {
  return (
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.MESSAGES} element={<Messages />}/>
          <Route path={ROUTES.HOLIDAYS} element={<Holidays />}/>
          <Route path={ROUTES.USERS} element={<Users />}/>
          <Route path={ROUTES.REFERENCES} element={<References />}/>
        </Routes>
  )
}

export default AppRoutes
