import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { useEffect, useState } from 'react'; // (o los hooks que ya tengas)

export default function ProductoDetalle({ productos, agregarAlCarrito }) {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const producto = productos.find((p) => p.id.toString() === id);

  if (!producto) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: '#fff' }}>
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', backgroundColor: '#00f885', color: '#000', borderRadius: '6px', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <main style={{ padding: 'clamp(15px, 5vw, 40px)', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>

      <button onClick={() => navigate(-1)} style={{ backgroundColor: 'transparent', border: 'none', color: '#00f885', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', marginBottom: 'clamp(20px, 4vw, 30px)', padding: 0 }}>
        <ArrowLeft size={20} /> Volver atrás
      </button>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(20px, 4vw, 50px)', backgroundColor: '#141414', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '12px', border: '1px solid #222' }}>

        {/* Redujimos el ancho base a 280px para que encaje perfecto en celulares pequeños sin desbordar */}
        <div style={{ flex: '1 1 280px', backgroundColor: '#1a1a1a', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'clamp(250px, 40vh, 400px)', padding: '20px' }}>
          {producto.imagen_url ? (
            <img src={producto.imagen_url} alt={producto.nombre} style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
          ) : (
            <Package size={100} color="#333" />
          )}
        </div>

        <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#00f885', fontWeight: 'bold', letterSpacing: '1px', fontSize: '14px', marginBottom: '10px' }}>
            {producto.categoria} / {producto.marca}
          </span>
          {/* El título se encoge en celulares y crece en PC */}
          <h1 style={{ margin: '0 0 20px 0', fontSize: 'clamp(24px, 5vw, 32px)', color: '#fff', lineHeight: '1.2' }}>{producto.nombre}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'clamp(28px, 6vw, 36px)', fontWeight: 'bold', color: '#fff' }}>Bs. {producto.precio}</span>
            <span style={{ padding: '5px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', backgroundColor: producto.estado_stock === 'Disponible' ? 'rgba(0, 255, 85, 0.1)' : 'rgba(255, 170, 0, 0.1)', color: producto.estado_stock === 'Disponible' ? '#00ff55' : '#ffaa00' }}>
              {producto.estado_stock}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px 0', borderTop: '1px solid #333', borderBottom: '1px solid #333', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa', fontSize: '15px' }}>
              <ShieldCheck size={20} color="#00f885" style={{ flexShrink: 0 }} /> Garantía oficial según fabricante
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa', fontSize: '15px' }}>
              <Truck size={20} color="#00f885" style={{ flexShrink: 0 }} /> Envíos a nivel nacional 100% seguros
            </div>
          </div>

          <p style={{ color: '#888', lineHeight: '1.6', marginBottom: '40px', fontSize: '15px', whiteSpace: 'pre-wrap' }}>
            {producto.descripcion
              ? producto.descripcion
              : `Este es un producto de alto rendimiento ideal para armar el setup de tus sueños. Cuenta con el respaldo directo de la marca ${producto.marca} y ha sido verificado por nuestros técnicos especializados.`
            }
          </p>

          {/* El margen 'auto' arriba empuja el botón siempre al fondo, alineándolo elegantemente */}
          <button
            onClick={() => agregarAlCarrito(producto)}
            disabled={producto.estado_stock === 'Agotado'}
            style={{
              marginTop: 'auto',
              backgroundColor: producto.estado_stock === 'Agotado' ? '#333' : '#00f885',
              color: producto.estado_stock === 'Agotado' ? '#666' : '#000',
              border: 'none',
              padding: '16px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: 'clamp(16px, 4vw, 18px)',
              cursor: producto.estado_stock === 'Agotado' ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.2s', width: '100%'
            }}
          >
            <ShoppingCart size={24} />
            {producto.estado_stock === 'Agotado' ? 'Producto Agotado' : 'Agregar al Carrito'}
          </button>
        </div>
      </div>
    </main>
  );
}