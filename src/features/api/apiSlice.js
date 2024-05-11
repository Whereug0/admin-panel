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

  if(result?.error?.originalStatus === 403) {
    console.log('Отправка запроса на обновление токена')

    const refreshResult = await baseQuery('/accounts/refresh/', api, extraOptions)
    const refreshToken = refreshResult?.data?.refresh; // Предположим, что токен находится в свойстве refreshToken объекта данных
    console.log(refreshToken)
    if(refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);

      const user = api.getState().auth.user;
      api.dispatch(setCredentials({...refreshResult.data.refresh, user}));

      // Повторно выполнить исходный запрос с обновленным токеном
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Если не удалось получить токен из ответа, разлогинить пользователя
      api.dispatch(logout());
    }
  }

  return result;
}



export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // getMessage: builder.query({
    //   query: () => "/main/message/", // Путь к эндпоинту для получения сообщений
    //   providesTags: result => ['Messages']
    // }),
    // createMessage: builder.mutation({
    //   query: (body) => ({
    //     url: '/main/message/',
    //     method: 'POST',
    //     body,
    //   }),
    //   invalidatesTags: ['Messages']
    // }),
    // updateMessage: builder.mutation({
    //   query: (message) => ({
    //     url: `/main/message/${message.id}/`,
    //     method: 'PUT',
    //     body: message,
    //   }),
    //   invalidatesTags: ['Messages']
    // }),
    // deleteMessage: builder.mutation({
    //   query: (message) => ({
    //     url: `/main/message/${message.id}/`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Messages']
    // })
  })
})


export const { 
  useGetMessageQuery, 
  useCreateMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = apiSlice;