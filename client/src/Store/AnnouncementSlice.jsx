import  {createSlice} from '@reduxjs/toolkit';
const Initval=[{
    data:" "
},]
const AnnouncementSlice=createSlice({
    data:"data",
    initialState:Initval,
    reducers:{
        saveAnnouncment
    }
})