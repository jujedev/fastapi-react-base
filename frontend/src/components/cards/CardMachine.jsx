/* eslint-disable prettier/prettier */
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import Stack from '@mui/material/Stack';

// import components
import AnalyticMachine from 'components/cards/statistics/AnalyticMachine';

export default function CardMachine({ name, image, description, status, metrics, extra }) {
  return (
    <Card sx={{ height: '100%', width: '100%', textAlign: 'center', p:2 }}>
      {image && (
        <CardMedia
          sx={{ height: 120, objectFit: 'cover', borderRadius: 3 }}
          component="img"
          image={image}
          alt={name}
        />
      )}
      <CardContent>
        {/* Nombre de la máquina */}
        <Typography variant="h6">{name}</Typography>

        {/* Descripción con dispositivos */}
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}

        {/* Estado general */}
        <Chip label={status} color={status == 'activo' ? 'success' : 'warning'} sx={{ mt:1, mb:2 }} />

        {/* Métricas claves */}
        {metrics && metrics.length > 0 ? (
          <Stack container spacing={1.25}>
            {metrics.map((m, idx) => (
              <AnalyticMachine key={idx} {...m} />
            ))}
          </Stack>
        ) : (
          extra && 
            <Typography variant="body2" color="text.secondary">
              {extra}
            </Typography>
        )}

        {/* Última actualización */}
        <Typography variant="caption" display="block" sx={{ mt:3 }}>
          Último dato: hace 10s
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'center' }}>
        <Button size="small">Configurar</Button>
        <Button size="small">Histórico</Button>
      </CardActions>
    </Card>
  );
}
