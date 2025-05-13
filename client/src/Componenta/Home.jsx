import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addFamily } from '../Store/familySlice';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Chip,
  Button,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  CircularProgress,
  Grid,
  Fade,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled,
  Alert
} from '@mui/material';

import {
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  Group as GroupIcon,
  AccessTime as AccessTimeIcon,
  NotificationsActive as NotificationsActiveIcon,
  Message as MessageIcon,
  ArrowDownward as ArrowDownwardIcon,
  Info as InfoIcon,
  Send as SendIcon,
  Call as CallIcon,
  WhatsApp as WhatsAppIcon,
  Mail as MailIcon,
  FamilyRestroom as FamilyRestroomIcon,
  Payments as PaymentsIcon,
  Construction as ConstructionIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Add as AddIcon,
  ElectricBolt as ElectricBoltIcon,
  WaterDrop as WaterDropIcon,
  ChildCare as ChildCareIcon,
  Password as PasswordIcon,
  Star
} from '@mui/icons-material';

// רכיב מותאם לכרטיס משפחה עם אנימציה
const AnimatedFamilyCard = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  transformStyle: 'preserve-3d',
  perspective: '1000px'
}));

// רכיב מותאם למחוון גלילה
const ScrollIndicator = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  left: '50%',
  bottom: 20,
  transform: 'translateX(-50%)',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(5px)',
  padding: '6px 12px',
  borderRadius: 30,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
}));

// מחוון התקדמות אנכי
const VerticalProgressIndicator = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  right: 20,
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1000,
  height: '50vh',
  width: 6,
  borderRadius: 3,
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  overflow: 'hidden'
}));

// מחוון התקדמות אנכי - החלק הפעיל
const VerticalProgressFill = styled(motion.div)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.primary.main,
  borderRadius: 3,
}));

// כפתור גלילה מעוצב
const ScrollButton = styled(motion.button)(({ theme, active }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[400],
  transition: 'all 0.3s ease',
  padding: 0,
  '&:hover': {
    transform: 'scale(1.2)',
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.grey[600]
  }
}));

// רכיב לאפקט הופעה בגלילה
const RevealWrapper = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// הטופס המותאם להוספת משפחה - המראה החדש
const FamilyFormDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    overflow: 'hidden',
    background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    transform: 'translateZ(0)',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '6px',
      background: 'linear-gradient(90deg, #2196f3, #e91e63, #f44336, #ff9800)',
      zIndex: 1,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '100%',
      background: 'radial-gradient(circle at top right, rgba(33, 150, 243, 0.05), transparent 70%)',
      zIndex: 0,
      pointerEvents: 'none'
    }
  }
}));

// רכיב אנימטיבי לכפתור שמירה
const ShineButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
    transform: 'rotate(30deg)',
    transition: 'all 550ms ease',
    opacity: 0
  },
  '&:hover::after': {
    opacity: 1,
    left: '100%',
    top: '100%',
    transition: 'all 550ms ease'
  }
}));

// רכיב נקודות רקע אנימטיביות
const BackgroundParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => i);

  return (
    <Box sx={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {particles.map((i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            borderRadius: '50%',
            backgroundColor: `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 200) + 55}, ${Math.random() * 0.3 + 0.1})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 30 - 15],
            x: [0, Math.random() * 30 - 15],
            opacity: [0.1, Math.random() * 0.5 + 0.2, 0.1]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      ))}
    </Box>
  );
};

// אנימציית כוכב
const StarAnimation = () => {
  return (
    <Box sx={{ position: 'absolute', top: -10, right: -10, zIndex: 2 }}>
      <motion.div
        animate={{
          rotate: [0, 15, -15, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <Star sx={{ fontSize: 40, color: '#FFD700' }} />
      </motion.div>
    </Box>
  );
};

// רכיב הבית עם הצגת משפחות
const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [families, setFamilies] = useState([]);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [newFamily, setNewFamily] = useState({
    nameFamily: '',
    floor: '',
    electricity: '',
    water: '',
    amountChildren: '',
    role: 'שכן רגיל',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const floorRefs = useRef([]);

  // טעינת המשפחות מהשרת
  useEffect(() => {
    console.log("Home component loaded");
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/Family/getAllFamilies');
        setFamilies(response.data);
        setLoading(false);
      } catch (error) {
        console.log("שגיאה בקבלת הנתונים", error);
        setLoading(false);
      }
    };

    // דמיית טעינה למשך שניה וחצי
    setTimeout(() => {
      fetchData();
    }, 1500);
  }, []);

  // ניהול טופס הוספת משפחה
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFamily(prev => ({ ...prev, [name]: value }));
  };

  // שמירת משפחה חדשה
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post(
        'http://localhost:3000/Family/createFamily',
        newFamily,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("נשמר בהצלחה", response.data);
      dispatch(addFamily(response.data)); // שמירה לרידקס
      setFamilies(prev => [...prev, response.data]); // עדכון מקומי ברשימה
      setFormDialogOpen(false); // סגירת הטופס
      setNewFamily({
        nameFamily: '',
        floor: '',
        electricity: '',
        water: '',
        amountChildren: '',
        role: 'שכן רגיל',
        password: ''
      });
    } catch (error) {
      console.log("שגיאה בשמירה", error.response ? error.response.data : error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ארגון המשפחות לפי קומות
  const familiesByFloor = families.reduce((acc, family) => {
    const floorIndex = parseInt(family.floor) - 1;
    if (isNaN(floorIndex) || floorIndex < 0) return acc;

    if (!acc[floorIndex]) acc[floorIndex] = [];
    acc[floorIndex].push(family);
    return acc;
  }, []);

  // מעקב אחרי גלילה
  const handleScroll = () => {
    if (containerRef.current) {
      // חישוב התקדמות הגלילה
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalScrollable = docHeight - windowHeight;
      const progress = Math.min(scrollTop / totalScrollable, 1);
      setScrollProgress(progress);

      // בדיקה איזו קומה נמצאת במרכז העמוד
      if (floorRefs.current.length > 0) {
        const viewportHeight = window.innerHeight;
        let closestIndex = 0;
        let closestDistance = Infinity;

        floorRefs.current.forEach((ref, index) => {
          if (ref) {
            const rect = ref.getBoundingClientRect();
            const distanceToCenter = Math.abs(rect.top + rect.height / 2 - viewportHeight / 2);

            if (distanceToCenter < closestDistance) {
              closestDistance = distanceToCenter;
              closestIndex = index;
            }
          }
        });

        setActiveFloorIndex(closestIndex);
      }
    }
  };

  // הוספת האזנה לאירוע גלילה
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // גלילה לקומה ספציפית
  const scrollToFloor = (index) => {
    if (floorRefs.current[index]) {
      const yOffset = -100; // התאמה לכותרת
      const y = floorRefs.current[index].getBoundingClientRect().top + window.pageYOffset + yOffset;

      // גלילה חלקה
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  // פתיחת מידע מפורט על המשפחה
  const handleOpenFamilyDetails = (family) => {
    setSelectedFamily(family);
    setDialogOpen(true);
  };

  // וריאנטים לאנימציות
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15
      }
    }
  };

  const scrollIconVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1,
        duration: 0.5,
        yoyo: Infinity,
        repeatDelay: 1
      }
    }
  };

  // מבנה העמוד המלא
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #f8f9fa, #e9ecef)',
        position: 'relative',
        overflowX: 'hidden', // מניעת גלילה אופקית
        padding: 0,
        margin: 0,
        direction: 'rtl' // הגדרת כיוון טקסט מימין לשמאל
      }}
    >
      {/* מסך טעינה */}
      <AnimatePresence>
        {loading && (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <motion.div
                  animate={{
                    rotateY: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <ApartmentIcon sx={{ fontSize: 60, mb: 2 }} />
                </motion.div>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  טוען את רשימת הדיירים...
                </Typography>
                <CircularProgress color="inherit" />
              </Box>
            </motion.div>
          </Backdrop>
        )}
      </AnimatePresence>

      {/* כותרת עליונה */}
      <Box
        component={motion.div}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          zIndex: 10,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ApartmentIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            דיירי הבניין
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="הוסף משפחה חדשה">
            <IconButton onClick={() => setFormDialogOpen(true)} color="primary">
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="הודעות חדשות">
            <IconButton>
              <Badge badgeContent={3} color="primary">
                <MessageIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="התראות">
            <IconButton>
              <Badge badgeContent={2} color="error">
                <NotificationsActiveIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="הגדרות">
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* מחוון התקדמות גלילה אנכי */}
      <VerticalProgressIndicator>
        <VerticalProgressFill
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </VerticalProgressIndicator>

      {/* חץ גלילה אנימטיבי */}
      <AnimatePresence>
        {!loading && families.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={scrollIconVariants}
            style={{
              position: 'fixed',
              bottom: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              גלול למטה
            </Typography>
            <KeyboardArrowDownIcon sx={{ color: 'primary.main', fontSize: 30 }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* מחוון גלילה קומות במרכז תחתית המסך */}
      {familiesByFloor.length > 0 && (
        <ScrollIndicator>
          {familiesByFloor.map((floor, index) => (
            <ScrollButton
              key={index}
              active={activeFloorIndex === index}
              onClick={() => scrollToFloor(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </ScrollIndicator>
      )}

      {/* תוכן עיקרי - רשימת משפחות */}
      <Box
        ref={containerRef}
        sx={{
          minHeight: '100vh',
          pt: '100px', // מרווח עבור הכותרת הקבועה
          pb: 10
        }}
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate={loading ? "hidden" : "visible"}
      >
        {familiesByFloor.length > 0 ? (
          familiesByFloor.map((floor, floorIndex) => (
            <Box
              key={floorIndex}
              ref={el => floorRefs.current[floorIndex] = el}
              sx={{
                py: 4,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <RevealWrapper delay={0.2}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      display: 'inline-flex',
                      alignItems: 'center',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -5,
                        left: '10%',
                        width: '80%',
                        height: 3,
                        borderRadius: 2,
                        background: 'linear-gradient(90deg, #2196f3, #21CBF3)',
                        opacity: 0.8
                      }
                    }}
                  >
                    קומה {floorIndex + 1}
                  </Typography>
                </Box>
              </RevealWrapper>

              <Grid container spacing={2} justifyContent="center">
                {floor.map((family, familyIndex) => (
                  <Grid item xs={12} md={6} key={family._id || familyIndex}>
                    <RevealWrapper delay={0.1 * (familyIndex + 1)}>
                      <AnimatedFamilyCard
                        variants={cardVariants}
                        whileHover="hover"
                        initial="hidden"
                        animate="visible"
                      >
                        <Paper
                          elevation={4}
                          sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            position: 'relative',
                            height: '100%',
                            transition: 'all 0.3s ease',
                            background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
                          }}
                        >
                          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${family.nameFamily}`}
                              sx={{
                                width: 70,
                                height: 70,
                                border: '3px solid',
                                borderColor: 'primary.main',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                              }}
                            />

                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" component="div" gutterBottom>
                                {family.nameFamily}
                              </Typography>

                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                <Chip
                                  size="small"
                                  icon={<HomeIcon />}
                                  label={`קומה ${family.floor}`}
                                  sx={{ borderRadius: 1 }}
                                />
                                {family.amountChildren && (
                                  <Chip
                                    size="small"
                                    icon={<ChildCareIcon />}
                                    label={`${family.amountChildren} ילדים`}
                                    sx={{ borderRadius: 1 }}
                                  />
                                )}
                                {family.role && (
                                  <Chip
                                    size="small"
                                    icon={<GroupIcon />}
                                    label={family.role}
                                    color={family.role === 'ועד בית' ? 'primary' : 'default'}
                                    sx={{ borderRadius: 1 }}
                                  />
                                )}
                              </Box>
                            </Box>

                            <Box>
                              <IconButton
                                onClick={() => handleOpenFamilyDetails(family)}
                                sx={{
                                  bgcolor: 'primary.light',
                                  color: 'common.white',
                                  '&:hover': {
                                    bgcolor: 'primary.main',
                                    transform: 'scale(1.1)',
                                  },
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                <InfoIcon />
                              </IconButton>
                            </Box>
                          </Box>

                          <Divider sx={{ opacity: 0.6 }} />

                          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-around' }}>
                            <Tooltip title="חשמל">
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <ElectricBoltIcon color="warning" />
                                <Typography variant="caption">{family.electricity || '0'}</Typography>
                              </Box>
                            </Tooltip>
                            <Tooltip title="מים">
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <WaterDropIcon color="info" />
                                <Typography variant="caption">{family.water || '0'}</Typography>
                              </Box>
                            </Tooltip>
                            <Tooltip title="שלח הודעה">
                              <IconButton color="primary">
                                <MessageIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="התקשר">
                              <IconButton color="success">
                                <CallIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Paper>
                      </AnimatedFamilyCard>
                    </RevealWrapper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        ) : (
          !loading && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '70vh',
                textAlign: 'center',
                p: 3
              }}
            >
              <ApartmentIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                אין משפחות רשומות עדיין
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
                נראה שאין משפחות רשומות במערכת. לחץ על כפתור "הוסף משפחה חדשה" כדי להתחיל.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setFormDialogOpen(true)}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                }}
              >
                הוסף משפחה חדשה
              </Button>
            </Box>
          )
        )}
      </Box>

      // קטע הקוד המתוקן עבור הטופס
<FamilyFormDialog
  open={formDialogOpen}
  onClose={() => setFormDialogOpen(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      maxHeight: '90vh',
      overflowY: 'auto', // חשוב להוסיף כדי לראות תוכן שחורג מגבולות הדיאלוג
    }
  }}
>
  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
    {/* רקע אנימטיבי */}
    <BackgroundParticles />
    
    {/* אנימציית כוכב */}
    <StarAnimation />
    
    <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
      {/* לוגו / אייקון עם אנימציה */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <motion.div
          whileHover={{
            scale: 1.05,
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.5 }
          }}
        >
          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: 'primary.main',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15), inset 0 -2px 0 rgba(0, 0, 0, 0.1)',
            }}
          >
            <motion.div
              animate={{
                rotateY: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            >
              <FamilyRestroomIcon sx={{ fontSize: 50 }} />
            </motion.div>
          </Avatar>
        </motion.div>
      </Box>

      {/* כותרת */}
      <Typography
        variant="h4"
        component="h2"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: '#1d3557',
          mb: 1
        }}
      >
        הוספת משפחה חדשה
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{ mb: 3 }}
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          מלא את הפרטים כדי להוסיף משפחה חדשה למערכת ניהול הבניין
        </motion.span>
      </Typography>

      {/* טיפ מועיל */}
      <Fade in={true} timeout={1000}>
        <Box sx={{ mb: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Alert
              severity="info"
              icon={<InfoIcon />}
              sx={{
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  marginRight: 1
                }
              }}
            >
              טיפ: המידע של המשפחה יהיה גלוי לכל דיירי הבניין
            </Alert>
          </motion.div>
        </Box>
      </Fade>

      {/* הטופס עצמו */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <TextField
                  fullWidth
                  label="שם משפחה"
                  name="nameFamily"
                  value={newFamily.nameFamily}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <FamilyRestroomIcon sx={{ mr: 1, color: 'primary.main' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                        boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                      },
                    },
                    mb: 2
                  }}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <TextField
                  fullWidth
                  label="קומה"
                  name="floor"
                  type="number"
                  value={newFamily.floor}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <ApartmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                        boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                      },
                    },
                    mb: 2
                  }}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <TextField
                  fullWidth
                  label="מספר ילדים"
                  name="amountChildren"
                  type="number"
                  value={newFamily.amountChildren}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <ChildCareIcon sx={{ mr: 1, color: 'primary.main' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                        boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                      },
                    },
                    mb: 2
                  }}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <TextField
                  fullWidth
                  label="חשמל"
                  name="electricity"
                  type="number"
                  value={newFamily.electricity}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <ElectricBoltIcon sx={{ mr: 1, color: 'warning.main' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                        boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                      },
                    },
                    mb: 2
                  }}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <TextField
                  fullWidth
                  label="מים"
                  name="water"
                  type="number"
                  value={newFamily.water}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <WaterDropIcon sx={{ mr: 1, color: 'info.main' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                        boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                      },
                    },
                    mb: 2
                  }}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <FormControl 
                  fullWidth 
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                        boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                      },
                    },
                    mb: 2
                  }}
                >
                  <InputLabel>תפקיד</InputLabel>
                  <Select
                    label="תפקיד"
                    name="role"
                    value={newFamily.role}
                    onChange={handleChange}
                    startAdornment={<GroupIcon sx={{ mr: 1, ml: -0.5, color: 'primary.main' }} />}
                  >
                    <MenuItem value="שכן רגיל">שכן רגיל</MenuItem>
                    <MenuItem value="ועד בית">ועד בית</MenuItem>
                  </Select>
                </FormControl>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <TextField
                  fullWidth
                  label="סיסמה"
                  name="password"
                  type="password"
                  value={newFamily.password}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <PasswordIcon sx={{ mr: 1, color: 'primary.main' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                        boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                      },
                    },
                    mb: 2
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
{console.log("gjhjgkhkjgjhj")}
          {/* כפתורי פעולה - חלק משמעותי שמודגש כדי לא להעלם */}
          {/* הכפתורים בחלק התחתון הקבוע */}
  {/* כפתורי פעולה - בתחתית הדיאלוג */}
<DialogActions sx={{ 
  p: 3, 
  bgcolor: 'rgba(245, 247, 250, 0.8)',
  borderTop: '1px solid rgba(0, 0, 0, 0.05)',
  justifyContent: 'space-between'
}}>
  <Button
    variant="outlined"
    onClick={() => setFormDialogOpen(false)}
    sx={{
      borderRadius: 2,
      padding: '10px 24px',
      fontWeight: 'medium',
      textTransform: 'none',
      fontSize: '1rem',
      minWidth: 120,
      borderWidth: 2,
      '&:hover': {
        borderWidth: 2
      }
    }}
  >
    ביטול
  </Button>
  
  <Button
    variant="contained"
    onClick={handleSubmit}
    disabled={isSubmitting}
    startIcon={<AddIcon />}
    sx={{
      borderRadius: 2,
      padding: '10px 24px',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      textTransform: 'none',
      minWidth: 140,
      background: isSubmitting
        ? 'primary.main'
        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      boxShadow: '0 5px 15px rgba(33, 203, 243, .3)',
      '&:hover': {
        background: 'linear-gradient(45deg, #1976D2 30%, #00A0C2 90%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 20px rgba(33, 150, 243, .4)',
      },
    }}
  >
    {isSubmitting ? (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={24} color="inherit" />
        <span>מעבד...</span>
      </Box>
    ) : (
      "הוסף משפחה"
    )}
  </Button>
</DialogActions>
        </Box>
      </motion.div>
    </Box>
  </Box>
</FamilyFormDialog>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
          }
        }}
      >
        {selectedFamily && (
          <>
            <DialogTitle
              sx={{
                pr: 6,
                background: 'linear-gradient(90deg, #2196f3, #21CBF3)',
                color: 'white',
                fontWeight: 'bold',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              פרטי {selectedFamily.nameFamily}
              <IconButton
                onClick={() => setDialogOpen(false)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${selectedFamily.nameFamily}`}
                  sx={{
                    width: 100,
                    height: 100,
                    mr: 3,
                    border: '4px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)'
                  }}
                />

                <Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1d3557' }}>
                    {selectedFamily.nameFamily}
                  </Typography>
                  <Typography variant="body1">
                    קומה {selectedFamily.floor}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedFamily.amountChildren} ילדים | {selectedFamily.role}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center'
              }}>
                <PaymentsIcon sx={{ mr: 1, fontSize: 20 }} />
                נתוני תשלום
              </Typography>
              <Paper sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: 'rgba(33, 150, 243, 0.05)' }}>
                <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <ElectricBoltIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 18, color: 'warning.main' }} />
                  חשמל: {selectedFamily.electricity || '0'}
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                  <WaterDropIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 18, color: 'info.main' }} />
                  מים: {selectedFamily.water || '0'}
                </Typography>
              </Paper>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Link to={`/family/${selectedFamily._id}`} style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    startIcon={<InfoIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    }}
                  >
                    לפרטים נוספים
                  </Button>
                </Link>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
              <Button
                startIcon={<MessageIcon />}
                onClick={() => setDialogOpen(false)}
                sx={{
                  fontWeight: 'medium',
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.05)'
                  }
                }}
              >
                שלח הודעה
              </Button>
              <Button
                variant="contained"
                onClick={() => setDialogOpen(false)}
                sx={{
                  fontWeight: 'bold',
                  borderRadius: 2,
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #00A0C2 90%)',
                  }
                }}
              >
                סגור
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Home;