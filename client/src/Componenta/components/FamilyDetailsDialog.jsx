import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Divider,
  Grid,
  Chip
} from '@mui/material';
import {
  ElectricBolt as ElectricBoltIcon,
  WaterDrop as WaterDropIcon,
  ChildCare as ChildCareIcon,
  Home as HomeIcon,
  Group as GroupIcon
} from '@mui/icons-material';

export const FamilyDetailsDialog = ({ open, onClose, family }) => {
  if (!family) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', color: '#f57c00' }}>
        פרטי משפחה
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${family.nameFamily}`}
            sx={{
              width: 100,
              height: 100,
              border: '3px solid',
              borderColor: '#f57c00',
              mb: 2
            }}
          />
          <Typography variant="h5" gutterBottom>
            {family.nameFamily}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {family.role}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HomeIcon color="primary" />
              <Typography variant="body1">
                קומה {family.floor}
              </Typography>
            </Box>
          </Grid>

          {family.amountChildren && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ChildCareIcon color="primary" />
                <Typography variant="body1">
                  {family.amountChildren} ילדים
                </Typography>
              </Box>
            </Grid>
          )}

          {family.electricity && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ElectricBoltIcon color="primary" />
                <Typography variant="body1">
                  חשמל: {family.electricity}
                </Typography>
              </Box>
            </Grid>
          )}

          {family.water && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WaterDropIcon color="primary" />
                <Typography variant="body1">
                  מים: {family.water}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<GroupIcon />}
            label={family.role}
            color="primary"
            variant="outlined"
          />
          {family.amountChildren && (
            <Chip
              icon={<ChildCareIcon />}
              label={`${family.amountChildren} ילדים`}
              color="secondary"
              variant="outlined"
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="contained" color="primary" fullWidth>
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 