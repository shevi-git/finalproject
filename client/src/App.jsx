import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Home from './Componenta/Home'
import User from './Componenta/User'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import FamilyDetails from './Componenta/FamilyDetails '
function App() {
  const [count, setCount] = useState(0)
  const [isAuth, setIsAuth] = useState(false); // האם המשתמש מחובר


  return (
    <>
      <Router>
        <nav className="navbar">
          <Link to="/Home">דף הבית</Link>
          <Link to="/">התחברות והרשמה</Link>
        </nav>

        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/" element={<User />} />
          <Route path="/Family/:id" element={<FamilyDetails />} />
        </Routes>
      </Router>


    </>
  )
}

export default App
