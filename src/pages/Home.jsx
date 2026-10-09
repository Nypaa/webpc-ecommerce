import { useState } from 'react';
import { ShoppingCart, Zap, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home({ busqueda, setBusqueda, productosFiltradosPorBusqueda, productos, agregarAlCarrito }) {
  const navigate = useNavigate();
  const [filtroLocal, setFiltroLocal] = useState('Todas');
 const categorias = [
    "Todas", "Procesadores", "Tarjetas Gráficas", "Placas Madre", "Memoria RAM", 
    "Almacenamiento", "Fuentes de Poder", "Case / Gabinetes", "Monitores", "Periféricos", "Combos", "Otros"
  ];
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
            src="https://dugjqlvigojxpzmhiasn.supabase.co/storage/v1/object/public/productos/kirubanner1.jpg" 
            alt="Banner Kiru Tech" 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      )}
            

      <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '24px', display: 'inline-block', borderBottom: '3px solid #00f885', paddingBottom: '10px' }}>
            {hayBusqueda ? 'Resultados de búsqueda' : 'Últimos Ingresos'}
          </h3>
          {hayBusqueda && (
            <button onClick={() => setBusqueda('')} style={{ backgroundColor: 'transparent', border: '1px solid #555', color: '#aaa', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
              Limpiar búsqueda
            </button>
          )}
        </div>

        {!hayBusqueda && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', paddingBottom: '10px' }}>
            <select 
              value={filtroLocal}
              onChange={(e) => setFiltroLocal(e.target.value)}
              style={{ 
                padding: '12px 20px', 
                backgroundColor: '#141414', 
                border: '1px solid #333', 
                color: '#fff', 
                borderRadius: '8px', 
                outline: 'none',
                fontSize: '15px',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '300px',
                appearance: 'none', // Oculta la flecha fea por defecto
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2300ff44%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 15px top 50%',
                backgroundSize: '12px auto',
              }}
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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
            <div 
              key={producto.id} 
              className="tarjeta-producto"
              style={{ backgroundColor: '#121a1c', border: '1px solid transparent', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
            >
              <div 
                onClick={() => navigate('/producto/' + producto.id)}
                className="contenedor-imagen-producto"
                style={{ width: '100%', height: '200px', backgroundColor: 'transparent', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', overflow: 'hidden', cursor: 'pointer' }}
              >
                {producto.imagen_url ? <img src={producto.imagen_url} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Package size={48} color="#333" />}
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#00f885', fontWeight: 'bold', letterSpacing: '1px' }}>{producto.marca}</span>
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
                    borderColor: producto.estado_stock === 'Agotado' ? '#333' : '#00f885', 
                    color: producto.estado_stock === 'Agotado' ? '#555' : '#00f885', 
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