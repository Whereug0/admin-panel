import { apiSlice } from "../api/apiSlice";
import { setCredentials } from "./authSlice";


export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/accounts/login/',
        method: 'POST',
        body: { ...credentials }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { user, access, refresh } = data;
          localStorage.setItem('accessToken', access);
          localStorage.setItem('refreshToken', refresh);
          dispatch(setCredentials({ user, access, refresh }));
        } catch (error) {
          console.error('Ошибка при логине', error);
        }
      }
    }),
  })
});


export const {
  useLoginMutation
} = authApiSlice