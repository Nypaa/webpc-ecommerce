import { useState } from 'react';
import { ShoppingCart, Zap, Package } from 'lucide-react';

export default function Home({ busqueda, setBusqueda, productosFiltradosPorBusqueda, productos, agregarAlCarrito }) {
  
  // NUEVO: Estado local exclusivo para la vitrina del Home
  const [filtroLocal, setFiltroLocal] = useState('Todas');
  
  const categoriasPrincipales = ["Todas", "Procesadores", "Tarjetas Gráficas", "Placas Madre", "Memoria RAM", "Monitores"];

  // LOGICA INTELIGENTE: 
  // Si el usuario escribe en el buscador, mostramos sus resultados sin límite.
  // Si el buscador está vacío, mostramos la vitrina con el filtro local (chips) y límite de 12.
  const hayBusqueda = busqueda.trim() !== '';
  
  const vitrinaEscaparate = productos
    .filter(p => filtroLocal === 'Todas' || p.categoria === filtroLocal)
    .slice(0, 12);

  const productosAMostrar = hayBusqueda ? productosFiltradosPorBusqueda : vitrinaEscaparate;

  return (
    <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box' }}>
      
      {!hayBusqueda && (
        <div style={{ width: '100%', boxSizing: 'border-box', height: '350px', background: 'linear-gradient(135deg, #111 0%, #002222 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 50px', marginBottom: '50px', border: '1px solid #222', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '350px', height: '350px', backgroundColor: '#00e5ff', filter: 'blur(150px)', opacity: '0.15', borderRadius: '50%' }}></div>
          <div style={{ zIndex: 1, maxWidth: '600px' }}>
            <span style={{ backgroundColor: '#00e5ff', color: '#000', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', letterSpacing: '1px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Zap size={14} /> NUEVA TEMPORADA
            </span>
            <h1 style={{ fontSize: '48px', margin: '20px 0', color: '#fff', lineHeight: '1.1' }}>
              Potencia tu <span style={{ color: '#00e5ff' }}>Setup</span> al Máximo Nivel.
            </h1>
            <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '30px', lineHeight: '1.6' }}>
              Descubre las mejores tarjetas gráficas, procesadores y periféricos. Construye la PC de tus sueños.
            </p>
            <button onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })} style={{ backgroundColor: '#00e5ff', color: '#000', border: 'none', padding: '14px 28px', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
              Ver Catálogo <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      )}

      {/* CABECERA DINÁMICA CON CHIPS */}
      <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '24px', display: 'inline-block', borderBottom: '3px solid #00e5ff', paddingBottom: '10px' }}>
            {hayBusqueda ? 'Resultados de búsqueda' : 'Últimos Ingresos'}
          </h3>
          {hayBusqueda && (
            <button onClick={() => setBusqueda('')} style={{ backgroundColor: 'transparent', border: '1px solid #555', color: '#aaa', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
              Limpiar búsqueda
            </button>
          )}
        </div>

        {/* LOS BOTONES DE FILTRO (CHIPS) - Solo se muestran si no hay búsqueda */}
        {!hayBusqueda && (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
            {categoriasPrincipales.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltroLocal(cat)}
                style={{
                  padding: '8px 16px', borderRadius: '20px', border: '1px solid #333', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                  backgroundColor: filtroLocal === cat ? '#00e5ff' : '#141414',
                  color: filtroLocal === cat ? '#000' : '#ccc'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        {productos.length === 0 ? (
          <p style={{ color: '#888' }}>Cargando inventario...</p>
        ) : productosAMostrar.length === 0 ? (
          <p style={{ color: '#888', gridColumn: '1 / -1' }}>No se encontraron productos.</p>
        ) : (
          productosAMostrar.map((producto) => (
            <div key={producto.id} style={{ backgroundColor: '#141414', border: '1px solid #222', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ width: '100%', height: '200px', backgroundColor: '#1a1a1a', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', overflow: 'hidden' }}>
                {producto.imagen_url ? <img src={producto.imagen_url} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Package size={48} color="#333" />}
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#00e5ff', fontWeight: 'bold', letterSpacing: '1px' }}>{producto.marca}</span>
                <h4 style={{ margin: '5px 0 10px 0', fontSize: '16px', color: '#fff', lineHeight: '1.4' }}>{producto.nombre}</h4>
                <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', backgroundColor: producto.estado_stock === 'Disponible' ? 'rgba(0, 255, 85, 0.1)' : 'rgba(255, 170, 0, 0.1)', color: producto.estado_stock === 'Disponible' ? '#00ff55' : '#ffaa00', marginBottom: '15px' }}>{producto.estado_stock}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>Bs. {producto.precio}</span>
                <button onClick={() => agregarAlCarrito(producto)} style={{ backgroundColor: 'transparent', border: '1px solid #00e5ff', color: '#00e5ff', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}