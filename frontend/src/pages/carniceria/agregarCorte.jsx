// src/pages/carniceria/AgregarCorte.jsx

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { TextField, Button, MenuItem, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';

const CATEGORIAS = ['Vaca', 'Cerdo', 'Achuras', 'Pollo', 'Cordero'];

// ==============================|| AGREGAR CORTE ||============================== //

export default function AgregarCorte() {
  const [form, setForm] = useState({
    nombre: '',
    categoria: '',
    precio_por_kilo: '',
    stock_actual: ''
  });
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    const numericFields = ['precio_por_kilo', 'stock_actual'];
    setForm({
      ...form,
      [field]: numericFields.includes(field) ? Number(value) : value
    });
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.categoria || !form.precio_por_kilo) {
      alert('Completá los campos obligatorios.');
      return;
    }
    try {
      await api.post('/productos/', form);
      alert('✅ Corte agregado correctamente');
      navigate('/cortes');
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || 'Error desconocido';
      alert(`❌ Error: ${detail}`);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', mt: 4, p: 6, borderRadius: 5, boxShadow: 24 }}>
      <Typography variant="h5" gutterBottom>
        Agregar nuevo corte
      </Typography>

      <TextField
        label="Nombre del corte *"
        fullWidth
        margin="normal"
        placeholder="Ej: Costillar vacuno"
        value={form.nombre}
        onChange={(e) => handleChange('nombre', e.target.value)}
      />

      <TextField
        select
        fullWidth
        label="Categoría *"
        value={form.categoria}
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
        label="Precio por kilo ($) *"
        type="number"
        fullWidth
        margin="normal"
        inputProps={{ min: 0, step: 100 }}
        value={form.precio_por_kilo}
        onChange={(e) => handleChange('precio_por_kilo', e.target.value)}
      />

      <TextField
        label="Stock inicial (kg)"
        type="number"
        fullWidth
        margin="normal"
        inputProps={{ min: 0, step: 0.5 }}
        value={form.stock_actual}
        onChange={(e) => handleChange('stock_actual', e.target.value)}
      />

      {/* Botones */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button variant="outlined" fullWidth color="secondary" LinkComponent={Link} to="/cortes">
          Cancelar
        </Button>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleSubmit}
          disabled={!form.nombre || !form.categoria || !form.precio_por_kilo}
        >
          Guardar
        </Button>
      </Box>
    </Box>
  );
}