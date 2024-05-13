import { apiSlice } from "../api/apiSlice";




const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/main/user/", 
      providesTags: result => ['Users']
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: '/main/user/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users']
    }),
    updateUser: builder.mutation({
      query: (user) => ({
        url: `/main/user/${user.id}/`,
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: ['Users']
    }),
    deleteUser: builder.mutation({
      query: (user) => ({
        url: `/main/user/${user.id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users']
    })
  })
})


export const { 
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;