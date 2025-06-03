import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
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
  Button, 
  Tooltip, 
  Avatar, 
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
  styled
} from '@mui/material';

import { 
  Home as HomeIcon, 
  Person, 
  Notifications, 
  Menu as MenuIcon,
  WbSunny
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
            width: '2px',
            height: '2px',
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
  const [weatherDialogOpen, setWeatherDialogOpen] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
  const cities = ['Jerusalem', 'Bnei Brak', 'Haifa', 'Modi\'in Illit'];

  // Fetch weather data when the dialog is open
  useEffect(() => {
    if (!weatherDialogOpen) return;

    async function fetchWeather(city) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/weather?city=${encodeURIComponent(city)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return {
          city: data.name,
          temp: data.main.temp,
          condition: data.weather[0].description,
        };
      } catch (error) {
        console.error(`Weather fetch failed for ${city}`, error);
        return null;
      }
    }

    async function fetchAllWeather() {
      const results = await Promise.all(cities.map(fetchWeather));
      setWeatherData(results.filter((r) => r !== null));
    }

    fetchAllWeather();
  }, [weatherDialogOpen]);

  // Navigation items
  const navItems = [
    { path: "/", label: "דף הבית", icon: <HomeIcon fontSize={isMobile ? "default" : "small"} /> },
    { path: "/login", label: "התחברות והרשמה", icon: <Person fontSize={isMobile ? "default" : "small"} /> },
    { path: "/NoticeBoard", label: "ללוח המודעות", icon: <Notifications fontSize={isMobile ? "default" : "small"} /> }
  ];

  return (
    <>
      <motion.div
        initial="visible"
        animate="visible"
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
                        }}
                      >
                        {item.label}
                      </Button>
                    </AnimatedNavLink>
                  </Link>
                ))}
                {/* Weather Button */}
                <Tooltip title="תחזית מזג האוויר">
                  <Button 
                    color="inherit" 
                    onClick={() => setWeatherDialogOpen(true)} 
                    startIcon={<WbSunny />} 
                  />
                </Tooltip>
              </Box>
            </Container>
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Weather Dialog */}
      <Dialog
        open={weatherDialogOpen}
        onClose={() => setWeatherDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            background: 'linear-gradient(135deg, #2196f3, #21CBF3)',
            color: 'white',
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            background: 'rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          תחזית מזג האוויר
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            padding: '20px',
          }}
        >
          {weatherData.length === 0 ? (
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              טוען נתוני מזג אוויר...
            </Typography>
          ) : (
            <List
              sx={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '10px',
              }}
            >
              {weatherData.map(({ city, temp, condition }) => (
                <ListItem
                  key={city}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:last-child': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    {city}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {temp}°C
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.9rem',
                        fontStyle: 'italic',
                      }}
                    >
                      {condition}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>

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
    </>
  );
}

export default AppRoutes;
