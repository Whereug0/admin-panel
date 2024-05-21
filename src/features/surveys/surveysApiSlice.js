import { apiSlice } from "../api/apiSlice";





const surveysApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSurveys: builder.query({
      query: () => "/main/survey/", 
      providesTags: result => ['Surveys']
    }),
    getSurveySingle: builder.query({
      query: (id) => `/main/survey/${id}`, 
      providesTags: result => ['SurveySingle']
    }),
    getSurveyIdQuestions: builder.query({
      query: (id) => `/main/survey/${id}/questions`, 
      providesTags: result => ['SurveySingleQuestions']
    }),
    getSurveyIdOption: builder.query({
      query: (questionId) => `/main/question/${questionId}/options/`, 
      providesTags: result => ['Options']
    }),
    createSurveyIdQuestions: builder.mutation({
      query: (id) => ({
        url: `/main/survey/${id}/questions`,
        method: 'POST',
        body: id
      }),
      invalidatesTags: ['SurveySingleQuestions']
    }),
    createSurveys: builder.mutation({
      query: (body) => ({
        url: '/main/survey/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Surveys']
    }),
    updateSurveys: builder.mutation({
      query: (survey) => ({
        url: `/main/survey/${survey.id}/`,
        method: 'PUT',
        body: survey.body,
      }),
      invalidatesTags: ['Surveys']
    }),
    
    deleteSurveys: builder.mutation({
      query: (survey) => ({
        url: `/main/survey/${survey.id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Surveys']
    })
  })
})


export const { 
  useCreateSurveysMutation,
  useGetSurveysQuery,
  useDeleteSurveysMutation,
  useUpdateSurveysMutation,

  useGetSurveySingleQuery,
  useGetSurveyIdQuestionsQuery,
  useCreateSurveyIdQuestionsMutation,

  useGetSurveyIdOptionQuery,

} = surveysApiSlice;