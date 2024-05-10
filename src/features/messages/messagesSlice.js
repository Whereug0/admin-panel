// import { fetchMessages } from "./actionCreator";
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   messages: [],
//   isLoading: false,
//   error: null,
// };

// const messagesSlice = createSlice({
//   name: "message",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchMessages.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.messages = action.payload
//         state.error = ''
//       })
//       .addCase(fetchMessages.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(fetchMessages.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload
//       })
//   }
// })


// export default messagesSlice.reducer
