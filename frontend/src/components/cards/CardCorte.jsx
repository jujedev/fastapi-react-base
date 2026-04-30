/* eslint-disable prettier/prettier */
import { Link } from 'react-router-dom';

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import Stack from '@mui/material/Stack';

// import componentes
import AnalyticDevice from 'components/cards/statistics/AnalyticDevice';

// Colores del Chip por categoría
const CATEGORIA_COLOR = {
  Vaca:    'error',
  Cerdo:   'warning',
  Achuras: 'secondary',
  Pollo:   'success',
  Cordero: 'info'
};

// Emoji por categoría (reemplaza la imagen del dispositivo)
const CATEGORIA_EMOJI = {
  Vaca:    '🐄',
  Cerdo:   '🐷',
  Achuras: '🫀',
  Pollo:   '🐔',
  Cordero: '🐑'
};

const UMBRAL_STOCK_BAJO = 10;

export default function CardCorte({ id, nombre, categoria, precio_por_kilo, stock_actual, activo }) {
  const stockBajo = parseFloat(stock_actual) < UMBRAL_STOCK_BAJO;
  const emoji = CATEGORIA_EMOJI[categoria] || '🥩';
  const chipColor = CATEGORIA_COLOR[categoria] || 'default';

  return (
    <Card sx={{ height: '100%', width: '100%', textAlign: 'center', boxShadow: 3, opacity: activo === false ? 0.5 : 1 }}>

      {/* Header — mismo layout que CardDevice */}
      <Box sx={{ pt: 1, pb: 1, pl: 1, pr: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'primary.lighter', minHeight: 100 }}>

        {/* Emoji en lugar de imagen */}
        <Box sx={{ p: 1, backgroundColor: 'white', height: 60, width: 60, borderRadius: 10, boxShadow: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography fontSize={28}>{emoji}</Typography>
        </Box>

        {/* Nombre del corte */}
        <Box>
          <CardContent>
            <Typography variant="h6">{nombre}</Typography>
          </CardContent>
        </Box>

        {/* Chip de categoría */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip
            label={categoria}
            color={chipColor}
            sx={{ mt: 0, mb: 0, p: 0, borderRadius: 2, width: 80, height: 40, fontSize: 9 }}
          />
        </Box>
      </Box>

      {/* Body */}
      <CardContent>
        <Stack spacing={1} padding={1}>
          <AnalyticDevice title="Precio:" data={`$${parseFloat(precio_por_kilo).toLocaleString('es-AR')} / kg`} />
          <AnalyticDevice
            title="Stock:"
            data={`${parseFloat(stock_actual).toFixed(2)} kg${stockBajo ? ' ⚠️' : ''}`}
          />
        </Stack>

        {/* Alerta stock bajo — equivalente al "Último estado" de CardDevice */}
        <Typography
          variant="caption"
          display="block"
          sx={{ mt: 3, color: stockBajo ? 'error.main' : 'text.secondary', fontWeight: stockBajo ? 700 : 400 }}
        >
          {stockBajo ? '⚠️ Stock bajo — menos de 10 kg' : 'Stock suficiente ✓'}
        </Typography>
      </CardContent>

      {/* Acciones — mismo layout que CardDevice */}
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button size="small" LinkComponent={Link} to={`/configCorte/${id}`}>
          Configurar
        </Button>
        <Button size="small" LinkComponent={Link} to="/ventas">
          Vender
        </Button>
      </CardActions>
    </Card>
  );
}