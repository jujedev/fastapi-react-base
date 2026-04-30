/* eslint-disable prettier/prettier */
// src/pages/carniceria/Historial.jsx

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import HistorialVentas from './sections/HistorialVentas';

export default function Historial() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Historial de Ventas</Typography>
      </Grid>
      <Grid size={12}>
        <HistorialVentas />
      </Grid>
    </Grid>
  );
}