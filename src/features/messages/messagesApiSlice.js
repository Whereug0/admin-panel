import { apiSlice } from "../api/apiSlice";




const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessage: builder.query({
      query: () => "/main/message/", 
      providesTags: result => ['Messages']
    }),
    createMessage: builder.mutation({
      query: (body) => ({
        url: '/main/message/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Messages']
    }),
    updateMessage: builder.mutation({
      query: (message) => ({
        url: `/main/message/${message.id}/`,
        method: 'PUT',
        body: message,
      }),
      invalidatesTags: ['Messages']
    }),
    
    deleteMessage: builder.mutation({
      query: (message) => ({
        url: `/main/message/${message.id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Messages']
    })
  })
})


export const { 
  useGetMessageQuery, 
  useCreateMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messagesApiSlice;