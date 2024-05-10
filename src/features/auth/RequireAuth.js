import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './authSlice'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '../../utils/routes'


const RequireAuth = () => {
  const token = useSelector(selectCurrentToken)
  const location = useLocation()

  return (
      token
          ? <Outlet />
          : <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  )
}

export default RequireAuth
