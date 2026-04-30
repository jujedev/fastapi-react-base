// src/pages/carniceria/Cortes.jsx

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// api
import { api } from '../../api/client';

// componente card
import CardCorte from 'components/cards/CardCorte';

// ==============================|| CORTES DE CARNE ||============================== //

export default function Cortes() {
  const [cortes, setCortes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/productos/')
      .then((res) => {
        setCortes(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75} alignItems="stretch">
      {/* Header */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Cortes de carne disponibles</Typography>
          <Button LinkComponent={Link} to="/agregarCorte" variant="outlined">
            Agregar corte +
          </Button>
        </Box>
      </Grid>

      {/* Loading */}
      {loading && (
        <Grid size={12}>
          <Typography color="text.secondary">Cargando cortes...</Typography>
        </Grid>
      )}

      {/* Sin resultados */}
      {!loading && cortes.length === 0 && (
        <Grid size={12}>
          <Typography color="text.secondary">
            No hay cortes cargados. ¡Agregá el primero!
          </Typography>
        </Grid>
      )}

      {/* Cards */}
      {cortes.map((corte, idx) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={corte.id || idx}>
          <CardCorte {...corte} />
        </Grid>
      ))}
    </Grid>
  );
}