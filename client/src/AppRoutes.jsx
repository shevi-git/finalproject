import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './Componenta/Home';
import User from './Componenta/User';
import CreateAnnouncement from './Componenta/CreateAnnouncement';
import Announcement from './Componenta/Announcement';
import NoticeBoard from './Componenta/NoticeBoard';

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <nav className="navbar" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        marginTop: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(40, 44, 52, 0.9)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <Link to="/Home">דף הבית</Link>
        <Link to="/">התחברות והרשמה</Link>
        <Link to="/NoticeBoard">ללוח המודעות</Link>
      </nav>

      <div style={{ marginTop: '60px' }}>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/" element={<User />} />
          <Route path="/CreateAnnouncement" element={<CreateAnnouncement />} />
          <Route path='/NoticeBoard' element={<NoticeBoard/>}/>
          <Route path="/Announcement" element={
            <Announcement 
              sex={location.state?.sex} 
              nameFamily={location.state?.nameFamily}
              wedding={location.state?.wedding}
            />} 
          />
        </Routes>
      </div>
    </>
  );
}

export default AppRoutes; 