import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import UserSlice from './Store/UserSlice';
import { configureStore } from '@reduxjs/toolkit'
import familySlice from './Store/familySlice .jsx'

const myStore=configureStore({
  reducer:{
    UserSlice:UserSlice,
    familySlice: familySlice,
  }
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={myStore}>
       <App />
    </Provider>
  </StrictMode>,
)
