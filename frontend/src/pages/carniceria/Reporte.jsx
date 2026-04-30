/* eslint-disable prettier/prettier */
// src/pages/carniceria/Reporte.jsx

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import ReporteDiario from './sections/ReporteDiario';

export default function Reporte() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Reporte Diario</Typography>
      </Grid>
      <Grid size={12}>
        <ReporteDiario />
      </Grid>
    </Grid>
  );
}