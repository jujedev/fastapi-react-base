/* eslint-disable prettier/prettier */
// src/pages/carniceria/sections/ReporteDiario.jsx

import { useState, useEffect } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';

// recharts
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// api
import { ventasApi } from 'api/carniceria';

const METODO_COLORS = {
  Efectivo: '#52c41a',
  'Débito': '#1890ff',
  'Crédito': '#fa8c16',
  Transferencia: '#13c2c2',
};

function MetricCard({ title, value, subtitle }) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: 2,
        textAlign: 'center',
        height: '100%',
        minHeight: 130,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={700} color="primary">
        {value}
      </Typography>
      {/* Siempre reserva el espacio aunque no haya subtitle */}
      <Typography variant="caption" color="text.secondary" sx={{ minHeight: 18, display: 'block' }}>
        {subtitle ?? ' '}
      </Typography>
    </Paper>
  );
}

export default function ReporteDiario() {
  const hoy = new Date().toISOString().split('T')[0];
  const [fecha, setFecha] = useState(hoy);
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ventasApi
      .reporteDiario(fecha)
      .then(setReporte)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fecha]);

  const chartData = reporte
    ? Object.entries(reporte.por_metodo_pago).map(([metodo, total]) => ({ metodo, total }))
    : [];

  return (
    <Grid container spacing={3}>
      {/* Selector de fecha */}
      <Grid size={12}>
        <TextField
          type="date"
          label="Fecha"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: hoy }}
          sx={{ width: 220 }}
        />
      </Grid>

      {loading ? (
        <Grid size={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Grid>
      ) : reporte ? (
        <>
          {/* Métricas */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <MetricCard
              title="💰 Total Recaudado"
              value={`$${reporte.total_recaudado.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <MetricCard
              title="🧾 Ventas"
              value={reporte.cantidad_ventas}
              subtitle="transacciones"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <MetricCard
              title="📊 Ticket Promedio"
              value={`$${reporte.ticket_promedio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`}
            />
          </Grid>

          {/* Gráfico por método de pago */}
          {chartData.length > 0 && (
            <Grid size={12}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Desglose por método de pago
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="metodo" />
                    <YAxis tickFormatter={(v) => `$${v.toLocaleString('es-AR')}`} />
                    <Tooltip formatter={(v) => `$${v.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`} />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry) => (
                        <Cell key={entry.metodo} fill={METODO_COLORS[entry.metodo] || '#8884d8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          )}

          {reporte.cantidad_ventas === 0 && (
            <Grid size={12}>
              <Typography color="text.secondary">No hay ventas registradas para esta fecha.</Typography>
            </Grid>
          )}
        </>
      ) : (
        <Grid size={12}>
          <Typography color="error">Error al cargar el reporte.</Typography>
        </Grid>
      )}
    </Grid>
  );
}