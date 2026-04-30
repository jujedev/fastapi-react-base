/* eslint-disable prettier/prettier */
// src/pages/carniceria/sections/FormularioVenta.jsx

import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';

// icons
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// hook y api
import { useCarrito } from 'hooks/useCarrito';
import { ventasApi } from 'api/carniceria';

const METODOS_PAGO = ['Efectivo', 'Débito', 'Crédito', 'Transferencia'];

export default function FormularioVenta({ productos, loading, onVentaConfirmada }) {
  const { carrito, agregarItem, quitarItem, limpiarCarrito, total } = useCarrito();

  const [productoId, setProductoId] = useState('');
  const [cantidadKg, setCantidadKg] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [enviando, setEnviando] = useState(false);

  // Snackbar
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const showSnack = (message, severity = 'success') => setSnack({ open: true, message, severity });

  const productoSeleccionado = productos.find((p) => p.id === productoId) || null;

  const handleAgregar = () => {
    if (!productoSeleccionado || !cantidadKg || parseFloat(cantidadKg) <= 0) {
      showSnack('Seleccioná un producto e ingresá una cantidad válida.', 'warning');
      return;
    }
    if (parseFloat(cantidadKg) > parseFloat(productoSeleccionado.stock_actual)) {
      showSnack(`Stock insuficiente. Disponible: ${productoSeleccionado.stock_actual} kg`, 'error');
      return;
    }
    agregarItem(productoSeleccionado, cantidadKg);
    setCantidadKg('');
  };

  const handleConfirmar = async () => {
    if (carrito.length === 0) {
      showSnack('El carrito está vacío.', 'warning');
      return;
    }
    setEnviando(true);
    try {
      const payload = {
        metodo_pago: metodoPago,
        detalles: carrito.map((i) => ({
          producto_id: i.producto_id,
          cantidad_kg: i.cantidad_kg,
        })),
      };
      const resultado = await ventasApi.registrar(payload);
      showSnack(`🎉 Venta #${resultado.id} registrada — Total: $${parseFloat(resultado.total).toLocaleString('es-AR')}`);
      limpiarCarrito();
      onVentaConfirmada(); // refresca stock en el padre
    } catch (err) {
      const detail = err.response?.data?.detail || 'Error al registrar la venta';
      showSnack(`❌ ${detail}`, 'error');
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* ── Selector de producto ── */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
          <Typography variant="h6" gutterBottom>
            Agregar al carrito
          </Typography>

          <TextField
            select
            fullWidth
            label="Corte"
            value={productoId}
            onChange={(e) => {
              setProductoId(e.target.value);
              setCantidadKg('');
            }}
            margin="normal"
          >
            {productos.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.nombre} — {p.categoria} — ${parseFloat(p.precio_por_kilo).toLocaleString('es-AR')}/kg
                {parseFloat(p.stock_actual) < 10 ? ' ⚠️' : ''}
              </MenuItem>
            ))}
          </TextField>

          {productoSeleccionado && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              Stock disponible: {parseFloat(productoSeleccionado.stock_actual).toFixed(2)} kg
            </Typography>
          )}

          <TextField
            fullWidth
            label="Cantidad (kg)"
            type="number"
            margin="normal"
            value={cantidadKg}
            inputProps={{ min: 0.1, step: 0.1, max: productoSeleccionado?.stock_actual || undefined }}
            onChange={(e) => setCantidadKg(e.target.value)}
          />

          {productoSeleccionado && cantidadKg > 0 && (
            <Typography variant="body2" color="primary" sx={{ mt: 1, ml: 1, fontWeight: 600 }}>
              Subtotal: ${(parseFloat(productoSeleccionado.precio_por_kilo) * parseFloat(cantidadKg)).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleAgregar}
            disabled={!productoSeleccionado || !cantidadKg}
          >
            + Agregar al carrito
          </Button>
        </Paper>
      </Grid>

      {/* ── Carrito ── */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            🛒 Carrito
          </Typography>

          {carrito.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              El carrito está vacío.
            </Typography>
          ) : (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Kg</TableCell>
                      <TableCell align="right">$/Kg</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {carrito.map((item) => (
                      <TableRow key={item.producto_id}>
                        <TableCell>{item.nombre}</TableCell>
                        <TableCell align="right">{item.cantidad_kg}</TableCell>
                        <TableCell align="right">${item.precio_por_kilo.toLocaleString('es-AR')}</TableCell>
                        <TableCell align="right">${item.subtotal.toLocaleString('es-AR')}</TableCell>
                        <TableCell>
                          <IconButton size="small" color="error" onClick={() => quitarItem(item.producto_id)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" align="right">
                Total: <strong>${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong>
              </Typography>

              <TextField
                select
                fullWidth
                label="Método de pago"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                margin="normal"
              >
                {METODOS_PAGO.map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </TextField>

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button variant="outlined" color="secondary" fullWidth onClick={limpiarCarrito}>
                  Limpiar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleConfirmar}
                  disabled={enviando}
                >
                  {enviando ? <CircularProgress size={20} color="inherit" /> : '✅ Confirmar venta'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} variant="filled" sx={{ width: '100%', color: 'white' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}