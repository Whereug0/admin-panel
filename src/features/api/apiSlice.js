import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../auth/authSlice";
import { BASE_URL } from "../../utils/constants";


const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  tagTypes: ['Messages', 'Holidays', 'Documents', 'Users', 'Surveys', 'SurveySingle', 'SurveySingleQuestions', 'Options'],
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log('Отправка запроса на обновление токена');

    const refreshToken = api.getState().auth.refresh;
    if (!refreshToken) {
      console.error('Refresh token отсутствует');
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await baseQuery({
      url: '/accounts/refresh/',
      method: 'POST',
      body: { refresh: refreshToken }
    }, api, extraOptions);

    console.log('refreshResult:', refreshResult);

    const newAccessToken = refreshResult?.data?.access;
    const newRefreshToken = refreshResult?.data?.refresh;
    console.log('newAccessToken:', newAccessToken);
    console.log('newRefreshToken:', newRefreshToken);

    if (newAccessToken && newRefreshToken) {
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      const user = api.getState().auth.user;
      api.dispatch(setCredentials({ user, access: newAccessToken, refresh: newRefreshToken }));

      // Повторно выполнить исходный запрос с обновленным токеном доступа
      result = await baseQuery(args, api, extraOptions);
      console.log('result после обновления токена:', result);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({})
});

export const {} = apiSlice;