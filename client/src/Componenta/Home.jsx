import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme, useMediaQuery } from '@mui/material';
import { Box, Backdrop, CircularProgress, Divider, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Alert, Snackbar, TextField } from '@mui/material';
import axios from 'axios';
import { addFamily } from '../redux/familySlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, Typography, IconButton, Badge, Tooltip, Grid, Paper, Button, Chip } from '@mui/material';
import { InfoIcon, HomeIcon, ChildCareIcon, GroupIcon, MessageIcon, CallIcon, ElectricBoltIcon, WaterDropIcon } from '../icons';
import { FamilyDetailsDialog, AddFamilyDialog } from '../dialogs';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AddIcon from '@mui/icons-material/Add';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import { logout } from '../Store/UserSlice';

// הוספת interceptor לכל הבקשות
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// קומפוננטת דף הבית בסגנון החדש
const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    amountChildren: '',
    role: 'שכן רגיל',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [familyToDelete, setFamilyToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'שכן רגיל');
  const [hasDeletePermission, setHasDeletePermission] = useState(false);
  // הוספת state להתראות
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [deletePassword, setDeletePassword] = useState("");
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [familyToUpdate, setFamilyToUpdate] = useState(null);
  const [updateFields, setUpdateFields] = useState({});
  const [updateError, setUpdateError] = useState(null);
  const [updatePassword, setUpdatePassword] = useState("");

  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const floorRefs = useRef([]);
  const navigate = useNavigate();

  // טעינת המשפחות מהשרת
  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      console.log('Token from localStorage:', token);
      
      if (!token) {
        console.log('No token found, redirecting to login');
        dispatch(logout());
        navigate('/');
        return;
      }

      console.log('Sending request to get all families...');
      const response = await axios.get('http://localhost:8000/Family/getAllFamilies', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Response from server:', response.data);
      setFamilies(response.data);
    } catch (error) {
      console.error('שגיאה בקבלת הנתונים', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Authentication error, redirecting to login');
        dispatch(logout());
        navigate('/');
      } else {
        setAlertMessage('אירעה שגיאה בטעינת הנתונים. אנא נסה שוב מאוחר יותר.');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  // בדיקת הרשאות מחיקה
  useEffect(() => {
    const checkDeletePermission = () => {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
      // רק מנהל או ועד בית יכולים למחוק
      setHasDeletePermission(role === 'מנהל' || role === 'ועד בית');
    };
    
    checkDeletePermission();
  }, []);

  // ניהול טופס הוספת משפחה
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFamily(prev => ({ ...prev, [name]: value }));
  };

  // שמירת משפחה חדשה
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/Family/createFamily',
        newFamily
      );

      console.log("נשמר בהצלחה", response.data);
      dispatch(addFamily(response.data)); 
      setFamilies(prev => [...prev, response.data]); 
      setFormDialogOpen(false); 
      setNewFamily({
        nameFamily: '',
        floor: '',
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

  // פונקציה לפתיחת דיאלוג אישור מחיקה
  
  const handleOpenDeleteDialog = (family) => {
    setFamilyToDelete(family);
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };
  // פונקציה לסגירת דיאלוג אישור מחיקה
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setFamilyToDelete(null);
    setDeleteError(null);
    setDeletePassword("");
  };

  // פונקציה למחיקת משפחה
  const handleDeleteFamily = async () => {
    if (!familyToDelete) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:8000/Family/deleteFamily/${familyToDelete._id}`, {
        data: { password: deletePassword }
      });
      
      // עדכון הרשימה המקומית
      setFamilies(prev => prev.filter(family => family._id !== familyToDelete._id));
      
      // סגירת הדיאלוג
      handleCloseDeleteDialog();
      
      // הצגת הודעת הצלחה
      setAlertMessage(
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2, 
          alignItems: 'center',
          p: 2,
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderRadius: 3,
          border: '1px solid rgba(76, 175, 80, 0.2)'
        }}>
          <Typography variant="h6" sx={{ 
            color: '#2e7d32', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <CheckCircleOutline sx={{ fontSize: '1.5rem' }} />
            המשפחה נמחקה בהצלחה
          </Typography>
        </Box>
      );
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      console.error('שגיאה במחיקת המשפחה', error);
      setDeleteError(
        error.response?.data?.message || 
        'אירעה שגיאה במחיקת המשפחה. אנא נסה שוב מאוחר יותר.'
      );
    } finally {
      setLoading(false);
    }
  };

  // פונקציה לניווט לדף פרטים נוספים
  const handleNavigateToDetails = (familyId) => {
    navigate(`/family-details/${familyId}`);
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
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

  const handleOpenUpdateDialog = (family) => {
    console.log('localStorage userId:', localStorage.getItem('userId'));
    console.log('family.userId:', family.userId);
    setFamilyToUpdate(family);
    setUpdateFields({ ...family });
    setUpdateDialogOpen(true);
    setUpdateError(null);
    setUpdatePassword("");
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setFamilyToUpdate(null);
    setUpdateFields({});
    setUpdateError(null);
    setUpdatePassword("");
  };

  const handleUpdateFieldChange = (e) => {
    const { name, value } = e.target;
    setUpdateFields(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateFamily = async () => {
    if (!familyToUpdate) return;
    try {
      setLoading(true);
      await axios.put(`http://localhost:8000/Family/updateFamily/${familyToUpdate._id}`, {
        ...updateFields,
        password: updatePassword
      });
      fetchFamilies();
      handleCloseUpdateDialog();
      setAlertMessage("המשפחה עודכנה בהצלחה");
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      console.error('Update error:', error);
      setUpdateError(
        error.response?.data?.message ||
        "אירעה שגיאה בעדכון המשפחה. אנא נסה שוב מאוחר יותר."
      );
    } finally {
      setLoading(false);
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
          <motion.div
            whileHover={{ 
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.5 }
            }}
          >
            <ApartmentIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
          </motion.div>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            דיירי הבניין
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            onClick={() => setFormDialogOpen(true)} 
            color="primary"
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      {/* מחוון התקדמות גלילה אנכי */}
      <Box
        sx={{
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
        }}
      >
        <motion.div
          style={{ 
            width: '100%', 
            height: `${scrollProgress * 100}%`,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 3
          }}
        />
      </Box>

      {/* מחוון גלילה קומות במרכז תחתית המסך */}
      {familiesByFloor.length > 0 && (
        <Box
          sx={{
            position: 'fixed',
            left: '50%',
            bottom: 20,
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(5px)',
            padding: '6px 12px',
            borderRadius: 30,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          {familiesByFloor.map((floor, index) => (
            <motion.button
              key={index}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                backgroundColor: activeFloorIndex === index ? theme.palette.primary.main : theme.palette.grey[400],
                padding: 0
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToFloor(index)}
            />
          ))}
        </Box>
      )}

      {/* תוכן עיקרי - רשימת משפחות בסגנון הדומה לתמונה */}
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
            <motion.div
              key={floorIndex}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 * floorIndex }}
            >
              <Box
                ref={el => floorRefs.current[floorIndex] = el}
                sx={{
                  py: 6,
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {/* המספר הגדול בסגנון התמונה */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 4 
                }}>
                  <Box sx={{ 
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Typography
                      variant="h1"
                      component="div"
                      sx={{
                        fontSize: { xs: '80px', md: '120px' },
                        fontWeight: 'bold',
                        lineHeight: 1,
                        opacity: 0.1,
                        mr: { xs: 2, md: 4 },
                        color: 'primary.main'
                      }}
                    >
                      {String(floorIndex + 1).padStart(2, '0')}
                    </Typography>
                    
                    <Box sx={{ position: 'absolute', right: 0 }}>
                      <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                          fontWeight: 'bold',
                          color: 'primary.main',
                          mb: 1
                        }}
                      >
                        קומה {floorIndex + 1}
                      </Typography>
                      
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ maxWidth: '80%' }}
                      >
                        {floor.length} משפחות מתגוררות בקומה זו
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                {/* משפחות הקומה */}
                <Box sx={{ pr: { xs: 0, md: 10 }, pl: { xs: 0, md: 6 } }}>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      color: 'text.secondary',
                      lineHeight: 1.8
                    }}
                  >
                  </Typography>

                  <Grid container spacing={3} sx={{ mt: 3 }}>
                    {floor.map((family, familyIndex) => (
                      <Grid item xs={12} md={6} key={family._id || familyIndex}>
                        <motion.div
                          whileHover={{ scale: 1.02, y: -5 }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 15
                          }}
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
                              '&:hover': {
                                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
                              }
                            }}
                          >
                            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
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
                              <Tooltip title="עדכן משפחה">
                                <IconButton
                                  color="primary"
                                  onClick={() => {
                                    const userRole = localStorage.getItem('userRole');
                                    const userId = localStorage.getItem('userId');
                                    const userIdFromLocal = localStorage.getItem('userId');
                                    const isOwner = family.userId && userIdFromLocal && family.userId.toString() === userIdFromLocal;

                                    // בדיקה אם המשתמש הוא בעל המשפחה או ועד בית
                                    const isHouseCommittee = userRole === 'houseCommittee' || userRole === 'ועד בית';
                                  
                                    if (isOwner || isHouseCommittee) {
                                      handleOpenUpdateDialog(family);
                                    } else {
                                      setAlertMessage("רק בעל המשפחה או ועד בית יכולים לעדכן את הפרטים");
                                      setAlertSeverity('error');
                                      setAlertOpen(true);
                                    }
                                  }}
                                  
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: 'primary.light',
                                      transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.3s ease'
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="מחק משפחה">
                                <IconButton 
                                  color="error"
                                  onClick={() => handleOpenDeleteDialog(family)}
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: 'error.light',
                                      transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.3s ease'
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Paper>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>

                </Box>
                
                {floorIndex < familiesByFloor.length - 1 && (
                  <Divider 
                    sx={{ 
                      mt: 8, 
                      mb: 4,
                      width: '80%',
                      mx: 'auto'
                    }} 
                  />
                )}
              </Box>
            </motion.div>
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
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  אין משפחות רשומות עדיין
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
                  נראה שאין משפחות רשומות במערכת. לחץ על כפתור "הוסף משפחה חדשה" כדי להתחיל.
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setFormDialogOpen(true)}
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    py: 1,
                    px: 3,
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  הוסף משפחה חדשה
                </Button>
              </motion.div>
            </Box>
          )
        )}
      </Box>

      {/* דיאלוג פרטי משפחה */}
      <FamilyDetailsDialog 
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        family={selectedFamily}
      />

      {/* דיאלוג הוספת משפחה */}
      <AddFamilyDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleSubmit}
        formData={newFamily}
        onChange={handleChange}
        isSubmitting={isSubmitting}
      />

      {/* דיאלוג אישור מחיקת משפחה */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: { xs: '90%', sm: 400 }
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'error.light', 
          color: 'error.contrastText',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <DeleteIcon />
          אישור מחיקת משפחה
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText>
            האם אתה בטוח שברצונך למחוק את משפחת {familyToDelete?.nameFamily}?
            <br />
            פעולה זו אינה ניתנת לביטול.
          </DialogContentText>
          <TextField
            label="סיסמה"
            type="password"
            fullWidth
            value={deletePassword}
            onChange={e => setDeletePassword(e.target.value)}
            sx={{ mt: 2 }}
          />
          {deleteError && (
            <Alert 
              severity="error" 
              sx={{ mt: 2 }}
              onClose={() => setDeleteError(null)}
            >
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              minWidth: 100
            }}
          >
            ביטול
          </Button>
          <Button
            onClick={handleDeleteFamily}
            variant="contained"
            color="error"
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              minWidth: 100
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                מוחק...
              </Box>
            ) : (
              'מחק'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* הוספת קומפוננטת Alert להתראות */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setAlertOpen(false)} 
          severity={alertSeverity}
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: 2
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* דיאלוג עדכון משפחה */}
      <Dialog open={updateDialogOpen} onClose={handleCloseUpdateDialog}>
        <DialogTitle>עדכון משפחה</DialogTitle>
        <DialogContent>
          <TextField
            label="שם משפחה"
            name="nameFamily"
            value={updateFields.nameFamily || ""}
            onChange={handleUpdateFieldChange}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="קומה"
            name="floor"
            value={updateFields.floor || ""}
            onChange={handleUpdateFieldChange}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="מספר ילדים"
            name="amountChildren"
            value={updateFields.amountChildren || ""}
            onChange={handleUpdateFieldChange}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="סיסמה"
            type="password"
            value={updatePassword}
            onChange={e => setUpdatePassword(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          {updateError && (
            <Alert severity="error" sx={{ mt: 2 }}>{updateError}</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>ביטול</Button>
          <Button onClick={handleUpdateFamily} variant="contained" color="primary" disabled={loading}>
            {loading ? "שומר..." : "שמור"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;