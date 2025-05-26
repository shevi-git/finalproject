import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Box, TextField, MenuItem, Paper, InputAdornment, IconButton, Zoom, Fade } from '@mui/material';
import { 
    Person, 
    Lock, 
    Apartment, 
    Info, 
    Home, 
    ChildCare, 
    Bolt, 
    WaterDrop 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

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

export const FamilyDetailsDialog = ({ open, onClose, family }) => {
    if (!family) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h5" component="div" align="center">
                    {family.nameFamily}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Home />
                            <Typography>קומה: {family.floor}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <ChildCare />
                            <Typography>מספר ילדים: {family.amountChildren}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Bolt />
                            <Typography>חשמל: {family.electricity}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <WaterDrop />
                            <Typography>מים: {family.water}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>סגור</Button>
            </DialogActions>
        </Dialog>
    );
};

export const AddFamilyDialog = ({ open, onClose, onSubmit, formData, onChange, isSubmitting }) => {
    const roles = [
        { value: 'שכן רגיל', label: 'שכן רגיל' },
        { value: 'ועד בית', label: 'ועד בית' },
        { value: 'מנהל', label: 'מנהל' }
    ];

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
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                }
            }}
        >
            <DialogContent sx={{ p: 4 }}>
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

                            <Box sx={{ p: 4 }}>
                                {/* לוגו ביניין / אייקון עם אנימציה */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                    <motion.div
                                        whileHover={{
                                            scale: 1.05,
                                            rotate: [0, -5, 5, 0],
                                            transition: { duration: 0.5 }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 90,
                                                height: 90,
                                                bgcolor: 'primary.main',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
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
                                                <Apartment sx={{ fontSize: 50, color: 'white' }} />
                                            </motion.div>
                                        </Box>
                                    </motion.div>
                                </Box>

                                {/* כותרת */}
                                <Typography
                                    variant="h4"
                                    component="h1"
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
                                    <motion.span variants={itemVariants}>
                                        מלא את הפרטים הבאים כדי להוסיף משפחה חדשה למערכת
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
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    bgcolor: 'info.light',
                                                    color: 'info.contrastText',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}
                                            >
                                                <Info />
                                                <Typography variant="body2">
                                                    כל השדות המסומנים ב-* הם שדות חובה
                                                </Typography>
                                            </Box>
                                        </motion.div>
                                    </Box>
                                </Fade>

                                <Box
                                    component="form"
                                    onSubmit={onSubmit}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2
                                    }}
                                >
                                    <motion.div variants={itemVariants}>
                                        <TextField
                                            fullWidth
                                            label="שם המשפחה"
                                            name="nameFamily"
                                            value={formData.nameFamily}
                                            onChange={onChange}
                                            required
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person color="primary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
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
                                            }}
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <TextField
                                            fullWidth
                                            label="קומה"
                                            name="floor"
                                            type="number"
                                            value={formData.floor}
                                            onChange={onChange}
                                            required
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Apartment color="primary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
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
                                            }}
                                        />
                                    </motion.div>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <motion.div variants={itemVariants}>
                                                <TextField
                                                    fullWidth
                                                    label="חשמל"
                                                    name="electricity"
                                                    type="number"
                                                    value={formData.electricity}
                                                    onChange={onChange}
                                                    required
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Bolt color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
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
                                                    }}
                                                />
                                            </motion.div>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <motion.div variants={itemVariants}>
                                                <TextField
                                                    fullWidth
                                                    label="מים"
                                                    name="water"
                                                    type="number"
                                                    value={formData.water}
                                                    onChange={onChange}
                                                    required
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <WaterDrop color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
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
                                                    }}
                                                />
                                            </motion.div>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <motion.div variants={itemVariants}>
                                                <TextField
                                                    fullWidth
                                                    label="מספר ילדים"
                                                    name="amountChildren"
                                                    type="number"
                                                    value={formData.amountChildren}
                                                    onChange={onChange}
                                                    required
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <ChildCare color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
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
                                                    }}
                                                />
                                            </motion.div>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <motion.div variants={itemVariants}>
                                                <TextField
                                                    fullWidth
                                                    select
                                                    label="תפקיד"
                                                    name="role"
                                                    value={formData.role}
                                                    onChange={onChange}
                                                    required
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Person color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
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
                                                    }}
                                                >
                                                    {roles.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </motion.div>
                                        </Grid>
                                    </Grid>

                                    <motion.div variants={itemVariants}>
                                        <TextField
                                            fullWidth
                                            label="סיסמה"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={onChange}
                                            required
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock color="primary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
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
                                            }}
                                        />
                                    </motion.div>

                                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                        <ShineButton
                                            onClick={onClose}
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                borderRadius: 2,
                                                py: 1.5,
                                                borderWidth: 2,
                                                '&:hover': {
                                                    borderWidth: 2,
                                                }
                                            }}
                                        >
                                            ביטול
                                        </ShineButton>
                                        <ShineButton
                                            onClick={onSubmit}
                                            disabled={isSubmitting}
                                            variant="contained"
                                            fullWidth
                                            sx={{
                                                borderRadius: 2,
                                                py: 1.5,
                                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                                                }
                                            }}
                                        >
                                            {isSubmitting ? 'שומר...' : 'שמור'}
                                        </ShineButton>
                                    </Box>
                                </Box>
                            </Box>
                        </AnimatedPaper>
                    </Zoom>
                </AnimatedContainer>
            </DialogContent>
        </Dialog>
    );
}; 