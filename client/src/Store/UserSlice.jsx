import  {createSlice} from '@reduxjs/toolkit';
const Initval=[{
    name:" ",
    email:" "
},];

const UserSlice=createSlice({
    name:"name",
    initialState:Initval,
    reducers:{
        saveUser:(state,action)=>
        {
            console.log(action.payload);
            const {name,email}=action.payload;
            if(name!==null||email!==null)
            {
                state.push(action.payload);
                console.log("user saving");               
            }
        }
        
    }
})
export const{saveUser}=UserSlice.actions;
export default UserSlice.reducer;