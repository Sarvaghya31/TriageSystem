// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// export const fetchChat = createAsyncThunk(
//   'user/fetchUser',
//   async (userId) => {
//     const response = await api.get(`/users/${userId}`);
//     return response.data; // This becomes `action.payload`
//   }
// );

// const userSlice = createSlice({
//   name: 'user',
//   initialState: { data: null, status: 'idle', error: null },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUser.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchUser.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.data = action.payload;
//       })
//       .addCase(fetchUser.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       });
//   }
// });

// export default userSlice.reducer;


import { createSlice } from '@reduxjs/toolkit';

const initialState={
    messages:[],
    ticketId:"",
}

const chatSlice = createSlice({
    name:"chat",
    initialState,
    reducers:{
        refreshChat:(state,action)=>{
            state.messages=action.payload.messages;
            state.ticketId=action.payload.ticketId;
        },
        addToChat:(state,action)=>{
            state.messages.push(action.payload);
        },   
    }
})

export const {refreshChat,addToChat}=chatSlice.actions;
export default chatSlice.reducer;

