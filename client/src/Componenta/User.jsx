import { useState, useEffect } from 'react';
import axios from 'axios';
import { saveUser, saveToken, logout } from '../Store/UserSlice';
import { useDispatch } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// ייבוא MUI וספריות נוספות
import {
    Box, Button, Container, Paper, Typography, TextField, InputAdornment, IconButton, Alert, Snackbar, Tabs, Tab, CircularProgress, Zoom,
    Slide, Fade, useTheme, useMediaQuery, Divider, Avatar, Chip, Tooltip, FormControlLabel, Checkbox, styled, AppBar, Toolbar, Menu, MenuItem
} from '@mui/material';

// ייבוא framer-motion לאנימציות מתקדמות
import { motion } from 'framer-motion';

// ייבוא אייקונים
import {
    Visibility, VisibilityOff, PersonAdd, Login, AlternateEmail, Lock, Person, CheckCircleOutline, ErrorOutline, LockReset,
    Apartment, Celebration, Star, Info, WarningAmber, Home, Notifications, Settings, Menu as MenuIcon
} from '@mui/icons-material';

// סטייל מותאם לאנימציות נוספות
const AnimatedContainer = styled(motion.div)({
    width: '100%'
});

const AnimatedPaper = styled(Paper)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
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
}));

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

// אנימציית הבהוב כוכב
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

// יצירת נקודות רקע אנימטיביות
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

// קומפוננטת תפריט ניווט
const NavigationBar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (path) => {
        navigate(path);
        handleClose();
    };

    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.05)',
                backdropFilter: 'blur(10px)',
                zIndex: theme.zIndex.drawer + 1,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: 'linear-gradient(90deg, #2196f3, #e91e63, #f44336, #ff9800)',
                    zIndex: 1,
                }
            }}
        >
            <Toolbar sx={{ 
                justifyContent: 'space-between',
                minHeight: '70px !important',
                px: { xs: 2, sm: 4 }
            }}>
                {/* לוגו */}
                <Box 
                    onClick={() => handleNavigation('/home')}
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        cursor: 'pointer',
                        '&:hover': {
                            transform: 'scale(1.05)',
                            transition: 'transform 0.3s ease'
                        }
                    }}
                >
                    <Avatar 
                        sx={{ 
                            bgcolor: 'primary.main',
                            width: 45,
                            height: 45,
                            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                        }}
                    >
                        <Apartment />
                    </Avatar>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: 'primary.main',
                            fontWeight: 'bold',
                            display: { xs: 'none', sm: 'block' },
                            fontSize: '1.4rem'
                        }}
                    >
                        ניהול בניין
                    </Typography>
                </Box>
                {isMobile ? (
                    <>
                        <IconButton
                            size="large"
                            edge="end"
                            color="primary"
                            aria-label="menu"
                            onClick={handleMenu}
                            sx={{
                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(33, 150, 243, 0.2)'
                                }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            PaperProps={{
                                sx: {
                                    mt: 1.5,
                                    minWidth: 200,
                                    borderRadius: 3,
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                    background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
                                    '& .MuiMenuItem-root': {
                                        py: 1.5,
                                        px: 2
                                    }
                                }
                            }}
                        >
                            <MenuItem 
                                onClick={() => handleNavigation('/home')} 
                                sx={{ 
                                    gap: 1,
                                    '&:hover': {
                                        backgroundColor: 'rgba(33, 150, 243, 0.1)'
                                    }
                                }}
                            >
                                <Home fontSize="small" />
                                דף הבית
                            </MenuItem>
                            <MenuItem 
                                onClick={() => handleNavigation('/announcements')} 
                                sx={{ 
                                    gap: 1,
                                    '&:hover': {
                                        backgroundColor: 'rgba(33, 150, 243, 0.1)'
                                    }
                                }}
                            >
                                <Notifications fontSize="small" />
                                הודעות
                            </MenuItem>
                            <MenuItem 
                                onClick={() => handleNavigation('/create-announcement')} 
                                sx={{ 
                                    gap: 1,
                                    '&:hover': {
                                        backgroundColor: 'rgba(33, 150, 243, 0.1)'
                                    }
                                }}
                            >
                                <PersonAdd fontSize="small" />
                                צור הודעה
                            </MenuItem>
                            <Divider sx={{ my: 1 }} />
                            <MenuItem 
                                onClick={() => handleNavigation('/user')} 
                                sx={{ 
                                    gap: 1,
                                    '&:hover': {
                                        backgroundColor: 'rgba(33, 150, 243, 0.1)'
                                    }
                                }}
                            >
                                <Person fontSize="small" />
                                התחברות
                            </MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Box sx={{ 
                        display: 'flex', 
                        gap: 2,
                        '& .MuiButton-root': {
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            transition: 'all 0.3s ease'
                        }
                    }}>
                        <Button
                            color="primary"
                            startIcon={<Home />}
                            onClick={() => handleNavigation('/home')}
                            sx={{ 
                                textTransform: 'none',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)'
                                }
                            }}
                        >
                            דף הבית
                        </Button>
                        <Button
                            color="primary"
                            startIcon={<Notifications />}
                            onClick={() => handleNavigation('/announcements')}
                            sx={{ 
                                textTransform: 'none',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)'
                                }
                            }}
                        >
                            הודעות
                        </Button>
                        <Button
                            color="primary"
                            startIcon={<PersonAdd />}
                            onClick={() => handleNavigation('/create-announcement')}
                            sx={{ 
                                textTransform: 'none',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)'
                                }
                            }}
                        >
                            צור הודעה
                        </Button>
                        <Button
                            color="primary"
                            startIcon={<Person />}
                            onClick={() => handleNavigation('/user')}
                            sx={{ 
                                textTransform: 'none',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)'
                                }
                            }}
                        >
                            התחברות
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

// קומפוננטה משודרגת עם הרבה אנימציות
export const User = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [action, setAction] = useState('register');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    const [typingEffect, setTypingEffect] = useState('');
    const [showTip, setShowTip] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const methods = useForm({
        mode: "onChange",
        defaultValues: {
            nameFamily: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const { register, handleSubmit, formState: { errors, isValid }, getValues, watch } = methods;

    // אפקט טיפינג לכותרת
    useEffect(() => {
        const titles = {
            register: 'ברוכים הבאים למערכת החכמה',
            login: 'שמחים לראות אותך שוב'
        };
        const targetText = titles[action];
        let i = 0;
        setTypingEffect('');

        const typing = setInterval(() => {
            if (i < targetText.length) {
                setTypingEffect(prev => prev + targetText.charAt(i));
                i++;
            } else {
                clearInterval(typing);
            }
        }, 50);

        return () => clearInterval(typing);
    }, [action]);

    // הצגת טיפ אחרי 3 שניות
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTip(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    // אנימציית הצלחה אחרי שליחת טופס
    const triggerSuccessAnimation = () => {
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 3000);
    };

    const checkEmailExists = async (email) => {
        if (!email || !email.includes('@')) return;
        
        try {
            const response = await axios.post('http://localhost:8000/user/check-email', { email });
            if (response.data.exists) {
                setEmailError(
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        color: '#f57c00',
                        fontSize: '0.875rem',
                        mt: 0.5
                    }}>
                        <WarningAmber sx={{ fontSize: '1rem' }} />
                        <Typography variant="caption" sx={{ color: '#f57c00' }}>
                            אימייל זה כבר קיים במערכת. אנא נסה להתחבר או השתמש באימייל אחר.
                        </Typography>
                    </Box>
                );
            } else {
                setEmailError('');
            }
        } catch (error) {
            console.error('Error checking email:', error);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await axios.post(
                `http://localhost:8000/user/${action === 'register' ? 'register' : 'login'}`,
                data
            );

            if (response.data.accessToken) {
                dispatch(saveToken(response.data.accessToken));
                const userData = {
                    nameFamily: response.data.user?.nameFamily || data.nameFamily,
                    email: response.data.user?.email || data.email,
                    role: response.data.user?.role || 'שכן רגיל'
                };
                dispatch(saveUser(userData));
                setAlertMessage('הפעולה בוצעה בהצלחה!');
                setAlertSeverity('success');
                setAlertOpen(true);
                setTimeout(() => {
                    navigate('/home');
                }, 1500);
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.status === 401) {
                dispatch(logout());
                setAlertMessage('שם משתמש או סיסמה שגויים');
                setAlertSeverity('error');
                setAlertOpen(true);
            } else if (error.response?.status === 409) {
                setAlertMessage('המשתמש כבר קיים במערכת');
                setAlertSeverity('error');
                setAlertOpen(true);
            } else {
                setAlertMessage('אירעה שגיאה. אנא נסה שוב מאוחר יותר');
                setAlertSeverity('error');
                setAlertOpen(true);
            }
        } finally {
            setLoading(false);
        }
    };

    // פונקציות לטיפול בתצוגת הסיסמה
    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    // הסגנון המשודרג לתיבות הקלט
    const inputStyle = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
                boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
            },
        },
        '& .MuiInputLabel-root': {
            color: theme.palette.text.secondary,
            transition: 'all 0.3s ease',
            '&.Mui-focused': {
                color: theme.palette.primary.main,
                fontWeight: 'bold',
            },
        },
        mt: 2,
        mb: 2,
    };

    // וריאנטים לאנימציות
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <AnimatedContainer
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Zoom in={true} timeout={800}>
                    <AnimatedPaper
                        elevation={24}
                        sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
                            position: 'relative',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.05)',
                            transform: 'translateZ(0)',
                            zIndex: 1
                        }}
                    >
                        {/* אנימציית רקע */}
                        <BackgroundParticles />

                        {/* אנימציית הצלחה */}
                        {showSuccessAnimation && (
                            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.2, 1] }}
                                        transition={{ duration: 0.5, times: [0, 0.7, 1] }}
                                    >
                                        <Celebration sx={{ fontSize: 80, color: '#4CAF50' }} />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                    >
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1d3557', mt: 2 }}>
                                            {action === 'register' ? 'נרשמת בהצלחה!' : 'התחברת בהצלחה!'}
                                        </Typography>
                                    </motion.div>
                                </motion.div>
                            </Box>
                        )}

                        <Box
                            sx={{
                                p: { xs: 3, sm: 4 },
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                zIndex: 1
                            }}
                        >
                            {/* לוגו ביניין / אייקון עם אנימציה */}
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
                                            <Apartment sx={{ fontSize: 50 }} />
                                        </motion.div>
                                    </Avatar>
                                </motion.div>
                            </Box>

                            {/* כותרת עם אנימציית טיפינג */}
                            <Typography
                                variant="h4"
                                component="h1"
                                align="center"
                                gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    color: '#1d3557',
                                    mb: 1,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        display: typingEffect.length === (action === 'register' ? 'ברוכים הבאים למערכת החכמה'.length : 'שמחים לראות אותך שוב'.length) ? 'none' : 'inline-block',
                                        width: '2px',
                                        height: '1em',
                                        backgroundColor: '#1d3557',
                                        marginLeft: '2px',
                                        animation: 'blink 1s step-end infinite',
                                    },
                                    '@keyframes blink': {
                                        'from, to': { opacity: 1 },
                                        '50%': { opacity: 0 },
                                    }
                                }}
                            >
                                {typingEffect}
                            </Typography>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                                align="center"
                                sx={{ mb: 3 }}
                            >
                                <motion.span
                                    variants={itemVariants}
                                >
                                    {action === 'register'
                                        ? 'צור חשבון ותהנה מניהול הבניין המתקדם ביותר'
                                        : 'התחבר למערכת ניהול הבניין המתקדמת ביותר'}
                                </motion.span>
                            </Typography>

                            {/* טיפ מועיל עם אנימציה */}
                            <Fade in={showTip} timeout={1000}>
                                <Box sx={{ mb: 3 }}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                    >
                                        <Alert
                                            severity="info"
                                            icon={<Info />}
                                            sx={{
                                                borderRadius: 2,
                                                '& .MuiAlert-icon': {
                                                    marginRight: 1
                                                }
                                            }}
                                        >
                                            {action === 'register'
                                                ? 'טיפ: סיסמה חזקה מכילה אותיות, מספרים ותווים מיוחדים'
                                                : 'הידעת? אתה יכול לשמור את פרטי ההתחברות עם "זכור אותי"'}
                                        </Alert>
                                    </motion.div>
                                </Box>
                            </Fade>

                            <FormProvider {...methods}>
                                <Box
                                    component="form"
                                    onSubmit={handleSubmit(onSubmit)}
                                    autoComplete="on"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                    }}
                                >
                                    {action === 'register' && (
                                        <motion.div variants={itemVariants}>
                                            <TextField
                                                fullWidth
                                                label="שם משפחה"
                                                id="nameFamily"
                                                autoComplete="name"
                                                variant="outlined"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Person color="primary" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={!!errors.nameFamily}
                                                helperText={errors.nameFamily?.message}
                                                sx={inputStyle}
                                                {...register("nameFamily", {
                                                    required: action === 'register' ? "שם המשפחה הוא שדה חובה" : false,
                                                    pattern: {
                                                        value: /^[א-ת\s]+$/,
                                                        message: "הכנס רק אותיות בעברית"
                                                    },
                                                    minLength: {
                                                        value: 2,
                                                        message: "שם המשפחה חייב להיות לפחות 2 תווים"
                                                    }
                                                })}
                                            />
                                        </motion.div>
                                    )}

                                    <motion.div variants={itemVariants}>
                                        <TextField
                                            fullWidth
                                            label="אימייל"
                                            type="email"
                                            id="email"
                                            autoComplete="email"
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AlternateEmail color="primary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={!!errors.email || !!emailError}
                                            helperText={errors.email?.message}
                                            sx={{
                                                ...inputStyle,
                                                '& .MuiFormHelperText-root': {
                                                    marginTop: 0.5
                                                }
                                            }}
                                            {...register("email", {
                                                required: "האימייל הוא שדה חובה",
                                                pattern: {
                                                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                                    message: "האימייל לא תקין"
                                                },
                                                onChange: (e) => {
                                                    if (action === 'register') {
                                                        checkEmailExists(e.target.value);
                                                    }
                                                }
                                            })}
                                        />
                                        {emailError && (
                                            <Box sx={{ 
                                                mt: 0.5, 
                                                mb: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                color: '#f57c00',
                                                fontSize: '0.875rem'
                                            }}>
                                                <WarningAmber sx={{ fontSize: '1rem' }} />
                                                <Typography variant="caption" sx={{ color: '#f57c00' }}>
                                                    משתמש עם אימייל זה כבר קיים במערכת
                                                </Typography>
                                            </Box>
                                        )}
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <TextField
                                            fullWidth
                                            label="סיסמה"
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            autoComplete={action === 'register' ? 'new-password' : 'current-password'}
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock color="primary" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleTogglePassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={!!errors.password}
                                            helperText={errors.password?.message}
                                            sx={inputStyle}
                                            {...register("password", {
                                                required: "הסיסמה היא שדה חובה",
                                                minLength: {
                                                    value: 6,
                                                    message: "הסיסמה חייבת להיות לפחות 6 תווים"
                                                }
                                            })}
                                        />
                                    </motion.div>

                                    {action === 'register' && (
                                        <motion.div variants={itemVariants}>
                                            <TextField
                                                fullWidth
                                                label="אמת סיסמה"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                id="confirmPassword"
                                                autoComplete="new-password"
                                                variant="outlined"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LockReset color="primary" />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleToggleConfirmPassword}
                                                                edge="end"
                                                            >
                                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={!!errors.confirmPassword}
                                                helperText={errors.confirmPassword?.message}
                                                sx={inputStyle}
                                                {...register("confirmPassword", {
                                                    required: action === 'register' ? "שדה זה הוא שדה חובה" : false,
                                                    validate: (value) =>
                                                        value === getValues("password") || "הסיסמאות אינן תואמות"
                                                })}
                                            />
                                        </motion.div>
                                    )}

                                    <motion.div
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <ShineButton
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            disabled={isSubmitting || !isValid}
                                            sx={{
                                                mt: 3,
                                                py: 1.5,
                                                borderRadius: 2,
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem',
                                                textTransform: 'none',
                                                background: isSubmitting
                                                    ? theme.palette.primary.main
                                                    : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                                boxShadow: '0 5px 15px rgba(33, 203, 243, .3)',
                                                transition: 'all 0.3s ease',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #1976D2 30%, #00A0C2 90%)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 20px rgba(33, 150, 243, .4)',
                                                },
                                                '&:active': {
                                                    transform: 'translateY(1px)',
                                                    boxShadow: '0 2px 8px rgba(33, 150, 243, .4)',
                                                }
                                            }}
                                            startIcon={isSubmitting ? null : action === 'register' ? <PersonAdd /> : <Login />}
                                        >
                                            {isSubmitting ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CircularProgress size={24} color="inherit" />
                                                    <span>מעבד...</span>
                                                </Box>
                                            ) : (
                                                action === 'register' ? "הרשמה למערכת" : "התחברות"
                                            )}
                                        </ShineButton>
                                    </motion.div>

                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <Button
                                            onClick={() => setAction(action === 'register' ? 'login' : 'register')}
                                            sx={{
                                                color: 'primary.main',
                                                textTransform: 'none',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(33, 150, 243, 0.04)'
                                                }
                                            }}
                                        >
                                            {action === 'register' ? 'כבר יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם'}
                                        </Button>
                                    </Box>
                                </Box>
                            </FormProvider>
                        </Box>
                    </AnimatedPaper>
                </Zoom>
            </AnimatedContainer>

            {/* הודעות התראה משודרגות */}
            <Snackbar
                open={alertOpen}
                autoHideDuration={action === 'register' ? 10000 : 6000}
                onClose={() => setAlertOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={Slide}
                TransitionProps={{ direction: 'down' }}
            >
                <Alert
                    onClose={() => setAlertOpen(false)}
                    severity={alertSeverity}
                    sx={{
                        width: '100%',
                        maxWidth: 400,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        borderRadius: 3,
                        '& .MuiAlert-icon': {
                            fontSize: '1.75rem',
                            padding: '8px 0'
                        },
                        '& .MuiAlert-message': {
                            width: '100%',
                            padding: '8px 0'
                        }
                    }}
                    variant="filled"
                    iconMapping={{
                        success: <CheckCircleOutline fontSize="inherit" />,
                        error: <ErrorOutline fontSize="inherit" />,
                        warning: <WarningAmber fontSize="inherit" />
                    }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default User;