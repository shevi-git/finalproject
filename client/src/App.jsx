import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Componenta/Home'
import User from './Componenta/User'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <User/>
      <Home/>
      hello
    </>
  )
}

export default App
