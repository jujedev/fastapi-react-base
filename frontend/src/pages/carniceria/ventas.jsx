/* eslint-disable prettier/prettier */
// src/pages/carniceria/Ventas.jsx

import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import FormularioVenta from './sections/FormularioVenta';
import { productosApi } from 'api/carniceria';

export default function Ventas() {
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);

  useEffect(() => {
    productosApi
      .getAll()
      .then(setProductos)
      .catch(console.error)
      .finally(() => setLoadingProductos(false));
  }, []);

  const handleVentaConfirmada = () => {
    productosApi.getAll().then(setProductos).catch(console.error);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Ventas</Typography>
      </Grid>
      <Grid size={12}>
        <FormularioVenta
          productos={productos}
          loading={loadingProductos}
          onVentaConfirmada={handleVentaConfirmada}
        />
      </Grid>
    </Grid>
  );
}