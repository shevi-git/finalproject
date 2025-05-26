import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './Componenta/Home';
import User from './Componenta/User';
import CreateAnnouncement from './Componenta/CreateAnnouncement';
import Announcement from './Componenta/Announcement';
import NoticeBoard from './Componenta/NoticeBoard';

// Styled components and animations
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Tooltip, 
  Avatar, 
  Container,
  useTheme,
  useMediaQuery,
  styled
} from '@mui/material';

import { 
  Home as HomeIcon, 
  Person, 
  Notifications, 
  Menu as MenuIcon,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';

// Animated Link Button component
const AnimatedNavLink = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  padding: '4px 15px',
  margin: '0 8px',
  borderRadius: '25px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #2196f3, #21CBF3)',
    borderRadius: '3px',
    transform: 'scaleX(0)',
    transformOrigin: 'center',
    transition: 'transform 0.3s ease',
  },
  '&:hover::before': {
    transform: 'scaleX(1)',
  }
}));

// Background particles for nav animation
const NavParticles = () => {
  const particles = Array.from({ length: 6 }, (_, i) => i);

  return (
    <Box sx={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {particles.map((i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            borderRadius: '50%',
            backgroundColor: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.05})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 20 - 10],
            x: [0, Math.random() * 20 - 10],
            opacity: [0.1, Math.random() * 0.3 + 0.1, 0.1]
          }}
          transition={{
            duration: Math.random() * 8 + 7,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      ))}
    </Box>
  );
};

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -20
  }
};

function AppRoutes() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Update active link when location changes
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  // Animation variants for nav bar
  const navVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: -60, opacity: 0 }
  };

  // Check if component loaded correctly
  useEffect(() => {
    console.log("AppRoutes loaded. Current location:", location.pathname);
  }, [location.pathname]);

  // Navigation items, kept consistent between mobile and desktop
  const navItems = [
    { path: "/", label: "דף הבית", icon: <HomeIcon fontSize={isMobile ? "default" : "small"} /> },
    { path: "/login", label: "התחברות והרשמה", icon: <Person fontSize={isMobile ? "default" : "small"} /> },
    { path: "/NoticeBoard", label: "ללוח המודעות", icon: <Notifications fontSize={isMobile ? "default" : "small"} /> }
  ];

  return (
    <>
      <motion.div
        initial="visible"
        animate={navVisible ? "visible" : "hidden"}
        variants={navVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          position: 'fixed',
          width: '100%',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <AppBar 
          position="static" 
          elevation={0}
          sx={{
            background: 'rgba(40, 44, 52, 0.85)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #2196f3, #e91e63, #f44336, #ff9800)',
              zIndex: 2,
            }
          }}
        >
          <Toolbar sx={{ justifyContent: 'center', py: 1 }}>
            {/* Background particles */}
            <NavParticles />
            
            <Container 
              maxWidth="lg"
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                direction: 'rtl' // RTL support
              }}
            >
              {isMobile ? (
                // Mobile view
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.main',
                          boxShadow: '0 2px 10px rgba(33, 150, 243, 0.3)'
                        }}
                      >
                        <MenuIcon />
                      </Avatar>
                    </motion.div>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {navItems.map((item) => (
                      <Tooltip key={item.path} title={item.label} arrow>
                        <Link to={item.path} style={{ textDecoration: 'none' }}>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Avatar 
                              sx={{ 
                                bgcolor: activeLink === item.path ? 'primary.main' : 'rgba(255,255,255,0.1)',
                                transition: 'all 0.3s ease',
                                transform: activeLink === item.path ? 'scale(1.1)' : 'scale(1)',
                                boxShadow: activeLink === item.path ? '0 2px 10px rgba(33, 150, 243, 0.3)' : 'none'
                              }}
                            >
                              {item.icon}
                            </Avatar>
                          </motion.div>
                        </Link>
                      </Tooltip>
                    ))}
                  </Box>
                </>
              ) : (
                // Desktop view
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', gap: 2 }}>
                  {navItems.map((item) => (
                    <Link 
                      key={item.path} 
                      to={item.path} 
                      style={{ textDecoration: 'none' }}
                      onClick={() => setActiveLink(item.path)}
                    >
                      <AnimatedNavLink
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          color="inherit"
                          startIcon={item.icon}
                          sx={{
                            color: 'white',
                            fontWeight: activeLink === item.path ? 'bold' : 'normal',
                            fontSize: '1rem',
                            textTransform: 'none',
                            position: 'relative',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              bottom: 0,
                              left: activeLink === item.path ? '0%' : '50%',
                              right: activeLink === item.path ? '0%' : '50%',
                              height: '2px',
                              background: 'linear-gradient(90deg, #2196f3, #21CBF3)',
                              borderRadius: '2px',
                              transition: 'all 0.3s ease',
                              display: activeLink === item.path ? 'block' : 'none',
                            }
                          }}
                        >
                          {item.label}
                        </Button>
                      </AnimatedNavLink>
                    </Link>
                  ))}
                </Box>
              )}
            </Container>
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Page transitions */}
      <Container maxWidth="lg" sx={{ mt: '70px', pt: 2, pb: 6 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<User />} />
            <Route path="/NoticeBoard" element={<NoticeBoard />} />
            <Route path="/Announcement" element={<Announcement />} />
          </Routes>
        </AnimatePresence>
      </Container>

      {/* Page navigation indicators for mobile */}
      {isMobile && (
        <Box 
          sx={{ 
            position: 'fixed', 
            bottom: 16, 
            left: '50%', 
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 900
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="contained"
              sx={{
                minWidth: 'auto',
                width: 40,
                height: 40,
                borderRadius: '50%',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                background: 'linear-gradient(135deg, #2196f3, #21CBF3)',
              }}
              onClick={() => window.history.back()}
            >
              <ArrowBack />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="contained"
              sx={{
                minWidth: 'auto',
                width: 40,
                height: 40,
                borderRadius: '50%',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                background: 'linear-gradient(135deg, #2196f3, #21CBF3)',
              }}
              onClick={() => window.history.forward()}
            >
              <ArrowForward />
            </Button>
          </motion.div>
        </Box>
      )}
    </>
  );
}

export default AppRoutes;