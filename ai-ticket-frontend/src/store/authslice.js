import {createSlice} from "@reduxjs/toolkit"
const initialState={
    status:false,
    loginData:null
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        logout:(state)=>{
            state.status=false;
            state.data=null;
        },
        login:(state,action)=>{
            state.status=true;
            state.loginData=action.payload;
        }
    },
})

export const {logout,login}=authSlice.actions;
export default authSlice.reducer;
