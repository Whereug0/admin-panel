import { apiSlice } from "../api/apiSlice";




const holidayApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHoliday: builder.query({
      query: () => "/main/holiday/", 
      providesTags: result => ['Holidays']
    }),
    createHoliday: builder.mutation({
      query: (body) => ({
        url: '/main/holiday/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Holidays']
    }),
    updateHolidays: builder.mutation({
      query: (holiday) => ({
        url: `/main/holiday/${holiday.id}/`,
        method: 'PUT',
        body: holiday.body,
      }),
      invalidatesTags: ['Holidays']
    }),
    deleteHolidays: builder.mutation({
      query: (holiday) => ({
        url: `/main/holiday/${holiday.id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Holidays']
    })
  })
})


export const { 
  useGetHolidayQuery,
  useCreateHolidayMutation,
  useUpdateHolidaysMutation,
  useDeleteHolidaysMutation,
} = holidayApiSlice;