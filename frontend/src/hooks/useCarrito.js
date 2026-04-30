// src/hooks/useCarrito.js
import { useState } from 'react';

export function useCarrito() {
  const [carrito, setCarrito] = useState([]);

  const agregarItem = (producto, cantidad_kg) => {
    const cantidad = parseFloat(cantidad_kg);
    const precio = parseFloat(producto.precio_por_kilo);
    const subtotal = precio * cantidad;

    // Si el producto ya está en el carrito, sumar cantidad
    setCarrito((prev) => {
      const existente = prev.findIndex((i) => i.producto_id === producto.id);
      if (existente >= 0) {
        const updated = [...prev];
        updated[existente] = {
          ...updated[existente],
          cantidad_kg: parseFloat((updated[existente].cantidad_kg + cantidad).toFixed(3)),
          subtotal: parseFloat((updated[existente].subtotal + subtotal).toFixed(2)),
        };
        return updated;
      }
      return [
        ...prev,
        {
          producto_id: producto.id,
          nombre: producto.nombre,
          categoria: producto.categoria,
          cantidad_kg: parseFloat(cantidad.toFixed(3)),
          precio_por_kilo: precio,
          subtotal: parseFloat(subtotal.toFixed(2)),
        },
      ];
    });
  };

  const quitarItem = (producto_id) => {
    setCarrito((prev) => prev.filter((i) => i.producto_id !== producto_id));
  };

  const limpiarCarrito = () => setCarrito([]);

  const total = carrito.reduce((acc, i) => acc + i.subtotal, 0);

  return { carrito, agregarItem, quitarItem, limpiarCarrito, total };
}