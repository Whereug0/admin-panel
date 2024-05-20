import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../auth/authSlice";
import { BASE_URL } from "../../utils/constants";


const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  tagTypes: ['Messages', 'Holidays', 'Documents', 'Users'],
  prepareHeaders: (headers, {getState}) => {
    const token = getState().auth.token
    const accessToken = localStorage.getItem('accessToken');
    if (token) {
      localStorage.setItem('accessToken', token);
      headers.set("Authorization", `Bearer ${token}`);
    } else if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  }
})


const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if(result.error && result.error.status === 401) {
    console.log('Отправка запроса на обновление токена')

    const refreshResult = await baseQuery('/accounts/refresh/', api, extraOptions)
    const { refresh: refreshToken } = refreshResult?.data; // Предположим, что токены находятся в свойствах access и refresh объекта данных
    console.log(refreshResult)
    if(refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
      
      const user = api.getState().auth.user;
      api.dispatch(setCredentials({ user, refreshToken }));

      // Повторно выполнить исходный запрос с обновленным токеном доступа
      result = await baseQuery(args, api, extraOptions);
      console.log(result)
    } else {
      // Если не удалось получить токены из ответа, разлогинить пользователя
      api.dispatch(logout());
    }
  }

  return result;
}




export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({})
})


export const {} = apiSlice;