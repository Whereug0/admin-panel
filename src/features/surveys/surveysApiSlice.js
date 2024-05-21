import { apiSlice } from "../api/apiSlice";





const surveysApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSurveys: builder.query({
      query: () => "/main/survey/",
      providesTags: result => ['Surveys']
    }),
    getSurveySingle: builder.query({
      query: (id) => `/main/survey/${id}/`,
      providesTags: result => ['SurveySingle']
    }),
    getSurveyIdQuestions: builder.query({
      query: (id) => `/main/survey/${id}/questions/`,
      providesTags: result => ['SurveySingleQuestions']
    }),
    getSurveyIdOption: builder.query({
      query: (questionId) => `/main/question/${questionId}/options/`,
      providesTags: result => ['Options']
    }),

    createSurveyIdQuestions: builder.mutation({
      query: (questionData) => ({
        url: `/main/survey/${questionData.surveyId}/questions/`,
        method: 'POST',
        body: questionData,
      }),
      invalidatesTags: ['SurveySingleQuestions']
    }),
    createSurveyIdOptions: builder.mutation({
      query: (optionData) => ({
        url: `/main/question/${optionData.questionId}/options/`,
        method: 'POST',
        body: optionData,
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
    updateSurveyIdOptions: builder.mutation({
      query: (questionId) => ({
        url: `/main/question/${questionId}/options/`,
        method: 'POST',
        body: questionId
      }),
      invalidatesTags: ['SurveySingleQuestions']
    }),

    deleteSurveys: builder.mutation({
      query: (survey) => ({
        url: `/main/survey/${survey.id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Surveys']
    }),
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/main/question/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SurveySingleQuestions']
    }),
  })
});

export const {
  useCreateSurveysMutation,
  useGetSurveysQuery,
  useDeleteSurveysMutation,
  useUpdateSurveysMutation,
  useGetSurveySingleQuery,
  useGetSurveyIdQuestionsQuery,
  useCreateSurveyIdQuestionsMutation,
  useDeleteQuestionMutation,
  useGetSurveyIdOptionQuery,
  useCreateSurveyIdOptionsMutation,
} = surveysApiSlice;