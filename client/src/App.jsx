import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Componenta/Home'
import User from './Componenta/User'
import { Provider } from 'react-redux'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
      <User/>
      <Home/>
     
    </>
  )
}

export default App;
