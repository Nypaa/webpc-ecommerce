import { useState } from 'react';
import { ShoppingCart, Zap, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home({ busqueda, setBusqueda, productosFiltradosPorBusqueda, productos, agregarAlCarrito }) {
  const navigate = useNavigate();
  const [filtroLocal, setFiltroLocal] = useState('Todas');
  const categoriasPrincipales = ["Todas", "Procesadores", "Tarjetas Gráficas", "Placas Madre", "Memoria RAM", "Monitores"];

  const hayBusqueda = busqueda.trim() !== '';

  const vitrinaEscaparate = productos
    .filter(p => filtroLocal === 'Todas' || p.categoria === filtroLocal)
    .slice(0, 12);

  const productosAMostrar = hayBusqueda ? productosFiltradosPorBusqueda : vitrinaEscaparate;

  return (
    <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box' }}>
      { !hayBusqueda && (
        <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '40px', border: '1px solid #333', backgroundColor: '#0a0a0a' }}>
          <img 
            src="https://dugjqlvigojxpzmhiasn.supabase.co/storage/v1/object/public/productos/kirubanner.jpg" 
            alt="Banner Kiru Tech" 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      )}
            

      <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '24px', display: 'inline-block', borderBottom: '3px solid #00ff44', paddingBottom: '10px' }}>
            {hayBusqueda ? 'Resultados de búsqueda' : 'Últimos Ingresos'}
          </h3>
          {hayBusqueda && (
            <button onClick={() => setBusqueda('')} style={{ backgroundColor: 'transparent', border: '1px solid #555', color: '#aaa', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
              Limpiar búsqueda
            </button>
          )}
        </div>

        {!hayBusqueda && (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
            {categoriasPrincipales.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltroLocal(cat)}
                style={{
                  padding: '8px 16px', borderRadius: '20px', border: '1px solid #333', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                  backgroundColor: filtroLocal === cat ? '#00ff44' : '#141414',
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
              <div 
                onClick={() => navigate('/producto/' + producto.id)}
                style={{ width: '100%', height: '200px', backgroundColor: '#1a1a1a', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', overflow: 'hidden', cursor: 'pointer' }}
              >
                {producto.imagen_url ? <img src={producto.imagen_url} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Package size={48} color="#333" />}
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#00ff44', fontWeight: 'bold', letterSpacing: '1px' }}>{producto.marca}</span>
                <h4 style={{ margin: '5px 0 10px 0', fontSize: '16px', color: '#fff', lineHeight: '1.4' }}>{producto.nombre}</h4>
                <span style={{ 
                  display: 'inline-block', 
                  padding: '3px 8px', 
                  borderRadius: '4px', 
                  fontSize: '11px', 
                  fontWeight: 'bold', 
                  backgroundColor: producto.estado_stock === 'Disponible' ? 'rgba(0, 255, 85, 0.1)' : producto.estado_stock === 'Poco Stock' ? 'rgba(255, 170, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)', 
                  color: producto.estado_stock === 'Disponible' ? '#00ff55' : producto.estado_stock === 'Poco Stock' ? '#ffaa00' : '#ff4444', 
                  marginBottom: '15px' 
                }}>
                  {producto.estado_stock}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>Bs. {producto.precio}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); agregarAlCarrito(producto); }} 
                  disabled={producto.estado_stock === 'Agotado'}
                  style={{ 
                    backgroundColor: producto.estado_stock === 'Agotado' ? '#222' : 'transparent', 
                    border: '1px solid', 
                    borderColor: producto.estado_stock === 'Agotado' ? '#333' : '#00ff44', 
                    color: producto.estado_stock === 'Agotado' ? '#555' : '#00ff44', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    cursor: producto.estado_stock === 'Agotado' ? 'not-allowed' : 'pointer', 
                    display: 'flex', alignItems: 'center', transition: 'all 0.2s' 
                  }}
                >
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