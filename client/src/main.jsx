import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import UserSlice from './Store/UserSlice';
import { configureStore } from '@reduxjs/toolkit'
const myStore=configureStore({
  reducer:{
    UserSlice:UserSlice
  }
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={myStore}>
       <App />
    </Provider>
  </StrictMode>,
)
