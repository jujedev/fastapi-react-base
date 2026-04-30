/* eslint-disable prettier/prettier */
import { Link } from 'react-router-dom';

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import Stack from '@mui/material/Stack';

// import componentes
import AnalyticDevice from 'components/cards/statistics/AnalyticDevice';

export default function CardDevice({ image, id, description, deviceId, host, intervalTime, port, rack, slaveId, slot, topic, type, status }) {
  return (
    <Card sx={{ height: '100%', width: '100%', textAlign: 'center', boxShadow: 3}}>
      {image && (
        <Box sx={{  pt: 1, pb: 1, pl: 1, pr: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'primary.lighter', minHeight: 100 }}>
          <Box sx={{ p: 1, backgroundColor: 'white', height: 60, width: 60, borderRadius: 10, boxShadow: 3 }}>
            <CardMedia
              sx={{ objectFit: 'contain', borderRadius: 2}}
              component="img"
              image={image}
              alt={description}
            />
          </Box>
          <Box>
            <CardContent>
              <Typography variant="h6">{deviceId}</Typography>
            </CardContent>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center'}}>
            <Chip label={status} color={status == 'RUN' ? 'success' : status == 'STOP' ? 'error' : status == 'ERROR' ? 'error' : status == 'UNKNOWN' ? 'default' : 'warning'}
            sx={{mt:0, mb:0, p:0, borderRadius: 2, width: 80, height: 40, fontSize: 9 }} />
          </Box>
        </Box>
      )}
      <CardContent>
        {/* Descripción con dispositivos */}
        {description && (
          <Typography variant="body2" color="text.secondary" mb={1.25}>
            {description}
          </Typography>
        )}
      <Stack container spacing={1} padding={1}>
        {host && (
          <AnalyticDevice title='IP: ' data={host}/>
        )}

        {rack >=0 && rack != null && (
          <AnalyticDevice title='Rack: ' data={rack}/>
        )}

        {slot && (
          <AnalyticDevice title='Slot: ' data={slot}/>
        )}

        {port && (
          <AnalyticDevice title='Puerto: ' data={port}/>
        )}

        {slaveId && (
          <AnalyticDevice title='Slave ID: ' data={slaveId}/>
        )}

        {topic && (
          <AnalyticDevice title='Topic: ' data={topic}/>
        )}

        {type && (
          <AnalyticDevice title='Protocolo: ' data={type}/>
        )}

        { intervalTime  && (
          <AnalyticDevice title='Ciclo de lectura (ms): ' data={intervalTime}/>
        )}
        </Stack>
        {/* Última actualización */}
        <Typography variant="caption" display="block" sx={{ mt:3 }}>
          Último estado: hace 10s
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "center" }}>
        <Button size="small" LinkComponent={Link} to={`/configDevice/${id}`}>
          Configurar
        </Button>
        <Button size="small">Histórico</Button>
      </CardActions>
    </Card>
  );
}
