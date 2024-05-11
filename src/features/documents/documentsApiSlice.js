import { apiSlice } from "../api/apiSlice";




const documentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDocument: builder.query({
      query: () => "/main/document/", // Путь к эндпоинту для получения сообщений
      providesTags: result => ['Documents']
    }),
    createDocument: builder.mutation({
      query: (body) => ({
        url: '/main/document/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Documents']
    }),
    updateDocument: builder.mutation({
      query: (document) => ({
        url: `/main/document/${document.id}/`,
        method: 'PUT',
        body: document,
      }),
      invalidatesTags: ['Documents']
    }),
    deleteDocument: builder.mutation({
      query: (document) => ({
        url: `/main/document/${document.id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Documents']
    })
  })
})


export const { 
  useGetDocumentQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} = documentsApiSlice;