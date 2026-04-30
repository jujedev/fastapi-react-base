// src/pages/carniceria/ConfigCorte.jsx

import { useState, useEffect } from 'react';
import { TextField, MenuItem, Box, Typography, Button, Alert, Snackbar } from '@mui/material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';

const CATEGORIAS = ['Vaca', 'Cerdo', 'Achuras', 'Pollo', 'Cordero'];

// ==============================|| EDITAR / ELIMINAR CORTE ||============================== //

export default function ConfigCorte() {
  const { id } = useParams();
  const [corte, setCorte] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Snackbar
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  useEffect(() => {
    api
      .get(`/productos/${id}`)
      .then((res) => setCorte(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (field, value) => {
    const numericFields = ['precio_por_kilo', 'stock_actual'];
    setCorte({
      ...corte,
      [field]: numericFields.includes(field) ? Number(value) : value
    });
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Seguro que querés eliminar "${corte.nombre}"?`)) return;
    try {
      // Desactivar en lugar de borrar (soft delete via PATCH)
      await api.patch(`/productos/${id}`, { activo: false });
      setMessage('🗑️ Corte eliminado');
      setSeverity('success');
      setOpen(true);
    } catch (err) {
      console.error(err);
      setMessage('❌ Error al eliminar el corte');
      setSeverity('error');
      setOpen(true);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`/productos/${id}`, {
        nombre: corte.nombre,
        categoria: corte.categoria,
        precio_por_kilo: corte.precio_por_kilo,
        stock_actual: corte.stock_actual
      });
      setMessage('✅ Corte actualizado');
      setSeverity('success');
      setOpen(true);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || 'Error desconocido';
      setMessage(`❌ Error: ${detail}`);
      setSeverity('error');
      setOpen(true);
    }
  };

  if (!corte) return <Typography>Cargando corte...</Typography>;

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', mt: 4, p: 6, borderRadius: 5, boxShadow: 24 }}>
      <Typography variant="h5" gutterBottom>
        {isEditing ? 'Editando: ' : ''}{corte.nombre}
      </Typography>

      <TextField
        label="Nombre del corte"
        fullWidth
        margin="normal"
        value={corte.nombre}
        disabled={!isEditing}
        onChange={(e) => handleChange('nombre', e.target.value)}
      />

      <TextField
        select
        fullWidth
        label="Categoría"
        value={corte.categoria}
        disabled={!isEditing}
        onChange={(e) => handleChange('categoria', e.target.value)}
        margin="normal"
      >
        {CATEGORIAS.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Precio por kilo ($)"
        type="number"
        fullWidth
        margin="normal"
        value={corte.precio_por_kilo}
        disabled={!isEditing}
        inputProps={{ min: 0, step: 100 }}
        onChange={(e) => handleChange('precio_por_kilo', e.target.value)}
      />

      <TextField
        label="Stock actual (kg)"
        type="number"
        fullWidth
        margin="normal"
        value={corte.stock_actual}
        disabled={!isEditing}
        inputProps={{ min: 0, step: 0.5 }}
        onChange={(e) => handleChange('stock_actual', e.target.value)}
      />

      {/* Botones */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button variant="outlined" fullWidth color="secondary" LinkComponent={Link} to="/cortes">
          Cancelar
        </Button>

        {!isEditing ? (
          <Button variant="contained" fullWidth color="warning" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
        ) : (
          <Button variant="contained" fullWidth color="primary" onClick={handleUpdate}>
            Guardar
          </Button>
        )}

        <Button variant="contained" fullWidth color="error" onClick={handleDelete}>
          Eliminar
        </Button>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={(_, reason) => {
          if (reason === 'clickaway') return;
          setOpen(false);
          if (severity === 'success') navigate('/cortes');
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ width: '70%' }}
      >
        <Alert severity={severity} variant="filled" onClose={() => setOpen(false)} sx={{ width: '100%', color: 'white' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}