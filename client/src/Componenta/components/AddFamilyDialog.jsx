import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  MenuItem,
  Alert
} from '@mui/material';

export const AddFamilyDialog = ({ open, onClose, newFamily, onChange, onSubmit, isSubmitting }) => {
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'nameFamily':
        return !value.trim() ? 'שם המשפחה הוא שדה חובה' : '';
      case 'floor':
        const floorNum = parseInt(value);
        if (!value) return 'קומה היא שדה חובה';
        if (isNaN(floorNum) || floorNum > 6 || floorNum < 0) return 'קומה חייבת להיות מספר בין 0 ל-6';
        return '';
      case 'password':
        return !value ? 'סיסמה היא שדה חובה' : '';
      case 'electricity':
      case 'water':
      case 'amountChildren':
        if (value && (isNaN(value) || value < 0)) return 'ערך חייב להיות מספר חיובי';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    onChange(e);
  };

  const handleSubmit = () => {
    const newErrors = {};
    Object.keys(newFamily).forEach(key => {
      const error = validateField(key, newFamily[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', color: '#f57c00' }}>
        הוספת משפחה חדשה
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="שם המשפחה"
            name="nameFamily"
            value={newFamily.nameFamily}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.nameFamily}
            helperText={errors.nameFamily}
          />
          <TextField
            fullWidth
            label="קומה"
            name="floor"
            type="number"
            value={newFamily.floor}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.floor}
            helperText={errors.floor}
            inputProps={{ min: 0, max: 6 }}
          />
          <TextField
            fullWidth
            label="מספר ילדים"
            name="amountChildren"
            type="number"
            value={newFamily.amountChildren}
            onChange={handleChange}
            margin="normal"
            error={!!errors.amountChildren}
            helperText={errors.amountChildren}
            inputProps={{ min: 0 }}
          />
          <TextField
            fullWidth
            select
            label="תפקיד"
            name="role"
            value={newFamily.role}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value="שכן רגיל">שכן רגיל</MenuItem>
            <MenuItem value="ועד בית">ועד בית</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="סיסמה"
            name="password"
            type="password"
            value={newFamily.password}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.password}
            helperText={errors.password}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">
          ביטול
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{ minWidth: 100 }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'שמור'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 