import { useState, useEffect } from 'react';
import axios from 'axios';
import { saveUser, saveToken } from '../Store/UserSlice';
import { useDispatch } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';

// ייבוא MUI וספריות נוספות
import {
    Box, Button, Container, Paper, Typography, TextField, InputAdornment, IconButton, Alert, Snackbar, Tabs, Tab, CircularProgress, Zoom,
    Slide, Fade, useTheme, useMediaQuery, Divider, Avatar, Chip, Tooltip, FormControlLabel, Checkbox, styled
} from '@mui/material';

// ייבוא framer-motion לאנימציות מתקדמות
import { motion } from 'framer-motion';

// ייבוא אייקונים
import {
    Visibility, VisibilityOff, PersonAdd, Login, AlternateEmail, Lock, Person, CheckCircleOutline, ErrorOutline, LockReset,
    Apartment, Celebration, Star, Info
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

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const dispatch = useDispatch();
    const methods = useForm({
        mode: "onChange", // בודק בזמן השינוי ולא רק בזמן השליחה
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

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const endpoint = action === 'register' ? '/register' : '/login';
            const payload = action === 'register'
                ? { name: data.username, email: data.email, password: data.password }
                : { email: data.email, password: data.password };

            const response = await axios.post(`http://localhost:8000/user${endpoint}`, payload);
            const token = response.data.accessToken;

            if (token) {
                localStorage.setItem('authToken', token);
                console.log('Token saved:', token);
                dispatch(saveToken(token)); // שמירה ל-redux אם יש
            }
    
            dispatch(saveUser({ name: data.username, email: data.email }));
            // או אם את משתמשת ב-Redux, תוכל להפעיל דיפוז יצירת פעולה שתשמור אותו בסטייט

            if (action === 'register') {
                console.log('נרשמת בהצלחה:', { name: data.username, email: data.email });
            }

            if (response.status === 200 || response.status === 201) {
                const token = response.data.token;
                setAlertMessage(`${action === 'register' ? 'ההרשמה' : 'ההתחברות'} בוצעה בהצלחה!`);
                setAlertSeverity('success');
                setAlertOpen(true);
                triggerSuccessAnimation();
                console.log(`${action === 'register' ? 'ההרשמה' : 'ההתחברות'} בוצעה בהצלחה!`);
            }
        } catch (error) {
            setAlertMessage(`שגיאה בתהליך ה${action === 'register' ? 'הרשמה' : 'התחברות'}: ${error.response?.data?.message || error.message}`);
            setAlertSeverity('error');
            setAlertOpen(true);
            console.error("שגיאה בחיבור לשרת:", error);
        }
        setIsSubmitting(false);
        const token = localStorage.getItem('authToken');
console.log('Saved token:', token);  // בדוק אם הטוקן נמצא

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

    // אינדיקטור של חוזק סיסמה
    const password = watch("password", "");
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: 'error' };

        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        const strengthMap = {
            0: { label: 'חלשה מאוד', color: 'error' },
            1: { label: 'חלשה', color: 'error' },
            2: { label: 'בינונית', color: 'warning' },
            3: { label: 'טובה', color: 'info' },
            4: { label: 'חזקה', color: 'success' },
            5: { label: 'חזקה מאוד', color: 'success' }
        };

        return { strength, ...strengthMap[strength] };
    };

    const passwordStrength = getPasswordStrength(password);

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
                            {/* אנימציית כוכב (אם יש מבצעים או חדשות) */}
                            {action === 'register' && <StarAnimation />}

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

                            {/* טאבים עם אנימציה */}
                            <Tabs
                                value={action === 'register' ? 0 : 1}
                                onChange={(e, newValue) => setAction(newValue === 0 ? 'register' : 'login')}
                                variant="fullWidth"
                                sx={{
                                    mb: 4,
                                    '& .MuiTab-root': {
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        transition: 'all 0.3s ease',
                                        '&.Mui-selected': {
                                            color: theme.palette.primary.main,
                                        },
                                    },
                                    '& .MuiTabs-indicator': {
                                        height: 3,
                                        borderRadius: 1.5,
                                        background: 'linear-gradient(to right, #2196F3, #21CBF3)',
                                    }
                                }}
                            >
                                <Tab
                                    label="הרשמה"
                                    icon={<PersonAdd />}
                                    iconPosition="start"
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(33, 150, 243, 0.05)',
                                        },
                                    }}
                                />
                                <Tab
                                    label="התחברות"
                                    icon={<Login />}
                                    iconPosition="start"
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(33, 150, 243, 0.05)',
                                        },
                                    }}
                                />
                            </Tabs>

                            <FormProvider {...methods}>
                                <motion.div
                                    key={action}
                                    initial={{ opacity: 0, x: action === 'register' ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
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
                                                    label="שם משתמש"
                                                    id="username"
                                                    autoComplete="username"
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Person color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    error={!!errors.username}
                                                    helperText={errors.username?.message}
                                                    sx={inputStyle}
                                                    {...register("username", {
                                                        required: "שם המשתמש הוא שדה חובה",
                                                        pattern: {
                                                            value: /^[A-Za-z]+$/,
                                                            message: "הכנס רק אותיות, ללא מספרים"
                                                        },
                                                        minLength: {
                                                            value: 3,
                                                            message: "שם המשתמש חייב להיות לפחות 3 תווים"
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
                                                error={!!errors.email}
                                                helperText={errors.email?.message}
                                                sx={inputStyle}
                                                {...register("email", {
                                                    required: "האימייל הוא שדה חובה",
                                                    pattern: {
                                                        value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                                        message: "האימייל לא תקין"
                                                    }
                                                })}
                                            />
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
                                                    pattern: {
                                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                        message: "הסיסמה חייבת לכלול לפחות 8 תווים, אות קטנה, אות גדולה, מספר ותו מיוחד"
                                                    }
                                                })}
                                            />

                                            {/* אינדיקטור חוזק סיסמה */}
                                            {password && action === 'register' && (
                                                <Box sx={{ mt: 1, mb: 1 }}>
                                                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                                                        חוזק הסיסמה: <Chip size="small" label={passwordStrength.label} color={passwordStrength.color} />
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        {[1, 2, 3, 4, 5].map((step) => (
                                                            <motion.div
                                                                key={step}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: '100%' }}
                                                                transition={{ duration: 0.4, delay: step * 0.1 }}
                                                                style={{ flex: 1 }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        height: 4,
                                                                        borderRadius: 2,
                                                                        backgroundColor: step <= passwordStrength.strength
                                                                            ? {
                                                                                1: '#f44336',
                                                                                2: '#ff9800',
                                                                                3: '#ffeb3b',
                                                                                4: '#8bc34a',
                                                                                5: '#4caf50'
                                                                            }[step]
                                                                            : '#e0e0e0',
                                                                    }}
                                                                />
                                                            </motion.div>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}
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
                                                        required: "שדה זה הוא שדה חובה",
                                                        validate: (value) =>
                                                            value === getValues("password") || "הסיסמאות אינן תואמות"
                                                    })}
                                                />
                                            </motion.div>
                                        )}

                                        {action === 'login' && (
                                            <motion.div variants={itemVariants}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                color="primary"
                                                                size="small"
                                                            />
                                                        }
                                                        label={
                                                            <Typography variant="body2">זכור אותי</Typography>
                                                        }
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: theme.palette.primary.main,
                                                            cursor: 'pointer',
                                                            position: 'relative',
                                                            '&:hover': {
                                                                textDecoration: 'underline',
                                                            },
                                                            '&::after': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                bottom: '-2px',
                                                                left: 0,
                                                                width: 0,
                                                                height: '1px',
                                                                backgroundColor: theme.palette.primary.main,
                                                                transition: 'width 0.3s ease'
                                                            },
                                                            '&:hover::after': {
                                                                width: '100%'
                                                            }
                                                        }}
                                                    >
                                                        שכחת את הסיסמה?
                                                    </Typography>
                                                </Box>
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
                                                disabled={isSubmitting}
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

                                        {/* אנימציית גבולות בזמן מעבר בין מצבים */}
                                        <Box sx={{ position: 'relative', my: 3 }}>
                                            <Divider>
                                                <Chip
                                                    label={action === 'register' ? "כבר רשום?" : "עדיין לא רשום?"}
                                                    size="small"
                                                    sx={{
                                                        background: 'linear-gradient(to right, #f8f9fa, #e9ecef, #f8f9fa)',
                                                        border: '1px solid #e9ecef',
                                                        fontWeight: 'medium'
                                                    }}
                                                />
                                            </Divider>
                                        </Box>

                                        {/* משפט לשינוי מצב עם אנימציה */}
                                        <motion.div
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => setAction(action === 'register' ? 'login' : 'register')}
                                                    startIcon={action === 'register' ? <Login /> : <PersonAdd />}
                                                    sx={{
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        px: 3,
                                                        py: 1,
                                                        fontSize: '0.9rem',
                                                        borderWidth: '1px',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            borderWidth: '1px',
                                                            backgroundColor: 'rgba(33, 150, 243, 0.05)',
                                                            transform: 'translateY(-1px)'
                                                        }
                                                    }}
                                                >
                                                    {action === 'register' ? 'התחבר עכשיו' : 'הירשם עכשיו'}
                                                </Button>
                                            </Box>
                                        </motion.div>
                                    </Box>
                                </motion.div>
                            </FormProvider>
                        </Box>
                    </AnimatedPaper>
                </Zoom>
            </AnimatedContainer>

            {/* הודעות התראה משודרגות */}
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={() => setAlertOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                TransitionComponent={Slide}
                TransitionProps={{ direction: 'up' }}
            >
                <Alert
                    onClose={() => setAlertOpen(false)}
                    severity={alertSeverity}
                    sx={{
                        width: '100%',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                            fontSize: '1.5rem'
                        }
                    }}
                    variant="filled"
                    iconMapping={{
                        success: <CheckCircleOutline fontSize="inherit" />,
                        error: <ErrorOutline fontSize="inherit" />,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {alertMessage}
                        </Typography>
                    </Box>
                </Alert>
            </Snackbar>

            {/* טיפים או הודעות בפינת המסך */}
            <Tooltip
                title={
                    <Box sx={{ p: 1 }}>
                        <Typography variant="body2">
                            {action === 'register'
                                ? 'הירשם עכשיו וקבל גישה למערכת ניהול הבניין המתקדמת ביותר!'
                                : 'התחבר כדי לנהל את הבניין שלך בקלות ובנוחות.'}
                        </Typography>
                    </Box>
                }
                placement="bottom-end"
                arrow
            >
                <Zoom in={true} timeout={1500}>
                    <Box
                        sx={{
                            position: 'fixed',
                            bottom: 24,
                            right: 24,
                            zIndex: 5000,
                            opacity: 0.9,
                            '&:hover': {
                                opacity: 1
                            }
                        }}
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                        >
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    bgcolor: 'primary.main',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    cursor: 'pointer',
                                    border: '2px solid white'
                                }}
                            >
                                <Info />
                            </Avatar>
                        </motion.div>
                    </Box>
                </Zoom>
            </Tooltip>
        </Container>
    );
};
export default User;