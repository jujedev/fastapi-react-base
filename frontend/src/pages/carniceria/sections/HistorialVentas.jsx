/* eslint-disable prettier/prettier */
// src/pages/carniceria/sections/HistorialVentas.jsx

import { useState, useEffect } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';

// icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// api
import { ventasApi } from 'api/carniceria';

const METODO_COLOR = {
  Efectivo: 'success',
  'Débito': 'primary',
  'Crédito': 'warning',
  Transferencia: 'info',
};

// ─── Fila individual ────────────────────────────────────────────────────────

function FilaVenta({ venta, onAnular }) {
  const [open, setOpen] = useState(false);
  const anulada = venta.anulada;

  return (
    <>
      <TableRow
        hover={!anulada}
        sx={{
          opacity: anulada ? 0.45 : 1,
          backgroundColor: anulada ? 'action.hover' : 'inherit',
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* Expandir detalle */}
        <TableCell sx={{ py: 0.5 }}>
          <IconButton size="small" onClick={() => setOpen(!open)} disabled={anulada}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        {/* ID */}
        <TableCell sx={{ color: anulada ? 'text.disabled' : 'text.primary' }}>
          #{venta.id}
          {anulada && (
            <Chip
              label="Anulada"
              size="small"
              sx={{ ml: 1, fontSize: 10, height: 18 }}
            />
          )}
        </TableCell>

        {/* Hora */}
        <TableCell sx={{ color: anulada ? 'text.disabled' : 'text.primary' }}>
          {new Date(venta.fecha_hora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
        </TableCell>

        {/* Método de pago */}
        <TableCell>
          <Chip
            label={venta.metodo_pago}
            color={anulada ? 'default' : (METODO_COLOR[venta.metodo_pago] || 'default')}
            size="small"
            sx={{ opacity: anulada ? 0.5 : 1 }}
          />
        </TableCell>

        {/* Total — tachado si está anulada */}
        <TableCell
          align="right"
          sx={{
            color: anulada ? 'text.disabled' : 'text.primary',
            textDecoration: anulada ? 'line-through' : 'none',
          }}
        >
          <strong>
            ${parseFloat(venta.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </strong>
        </TableCell>

        {/* Acción */}
        <TableCell align="center">
          {!anulada ? (
            <Tooltip title="Devuelve el stock automáticamente">
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => onAnular(venta)}
                sx={{ fontSize: 11, py: 0.25, px: 1 }}
              >
                Anular
              </Button>
            </Tooltip>
          ) : (
            <Typography variant="caption" color="text.disabled">—</Typography>
          )}
        </TableCell>
      </TableRow>

      {/* Detalle expandible */}
      <TableRow>
        <TableCell colSpan={6} sx={{ py: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Detalle de la venta
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Kg</TableCell>
                    <TableCell align="right">$/Kg</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {venta.detalles?.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.producto?.nombre || `ID ${d.producto_id}`}</TableCell>
                      <TableCell align="right">{d.cantidad_kg}</TableCell>
                      <TableCell align="right">
                        ${parseFloat(d.precio_unitario).toLocaleString('es-AR')}
                      </TableCell>
                      <TableCell align="right">
                        ${parseFloat(d.subtotal).toLocaleString('es-AR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// ─── Componente principal ───────────────────────────────────────────────────

export default function HistorialVentas() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ventaAAnular, setVentaAAnular] = useState(null);
  const [anulando, setAnulando] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const showSnack = (message, severity = 'success') =>
    setSnack({ open: true, message, severity });

  useEffect(() => {
    ventasApi
      .getAll()
      .then(setVentas)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleConfirmarAnulacion = async () => {
    if (!ventaAAnular) return;
    setAnulando(true);
    try {
      await ventasApi.anular(ventaAAnular.id);
      // Actualización local instantánea — sin re-fetch
      setVentas((prev) =>
        prev.map((v) => (v.id === ventaAAnular.id ? { ...v, anulada: true } : v))
      );
      showSnack(`Venta #${ventaAAnular.id} anulada. Stock devuelto correctamente.`);
    } catch (err) {
      const detail = err.response?.data?.detail || 'Error al anular la venta';
      showSnack(`❌ ${detail}`, 'error');
    } finally {
      setAnulando(false);
      setVentaAAnular(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (ventas.length === 0) {
    return <Typography color="text.secondary">No hay ventas registradas.</Typography>;
  }

  const activas = ventas.filter((v) => !v.anulada).length;
  const anuladas = ventas.filter((v) => v.anulada).length;

  return (
    <>
      {/* Contador rápido */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {activas} venta{activas !== 1 ? 's' : ''} activa{activas !== 1 ? 's' : ''}
        </Typography>
        {anuladas > 0 && (
          <Typography variant="body2" color="text.disabled">
            · {anuladas} anulada{anuladas !== 1 ? 's' : ''}
          </Typography>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Venta</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>Pago</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventas.map((v) => (
              <FilaVenta key={v.id} venta={v} onAnular={setVentaAAnular} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog confirmación — evita anulaciones por click accidental */}
      <Dialog
        open={!!ventaAAnular}
        onClose={() => !anulando && setVentaAAnular(null)}
      >
        <DialogTitle>Anular venta #{ventaAAnular?.id}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Confirmás la anulación de esta venta por{' '}
            <strong>
              ${ventaAAnular
                ? parseFloat(ventaAAnular.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })
                : ''}
            </strong>?
            <br /><br />
            El stock de todos los productos será devuelto automáticamente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVentaAAnular(null)} disabled={anulando}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarAnulacion}
            color="error"
            variant="contained"
            disabled={anulando}
          >
            {anulando
              ? <CircularProgress size={18} color="inherit" />
              : 'Sí, anular'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          sx={{ width: '100%', color: 'white' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}