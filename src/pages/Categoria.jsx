import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, ArrowLeft } from 'lucide-react';

export default function Categoria({ productos, agregarAlCarrito }) {
  const { id } = useParams(); // Lee la categoría desde la URL
  const navigate = useNavigate();

  // Filtramos el catálogo global para que solo muestre la categoría actual
  const productosDeCategoria = productos.filter(
    (producto) => producto.categoria === id
  );

  return (
    <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box' }}>
      
      {/* CABECERA DE LA CATEGORÍA */}
      <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ backgroundColor: '#1f1f1f', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '32px', letterSpacing: '1px' }}>
            {id}
          </h2>
          <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '14px' }}>
            {productosDeCategoria.length} productos disponibles
          </p>
        </div>
      </div>

      {/* GRID DE RESULTADOS (Aquí implementaremos la paginación más adelante) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        {productosDeCategoria.length === 0 ? (
          <p style={{ color: '#888', gridColumn: '1 / -1' }}>No hay productos registrados en esta categoría por el momento.</p>
        ) : (
          productosDeCategoria.map((producto) => (
            <div key={producto.id} style={{ backgroundColor: '#141414', border: '1px solid #222', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ width: '100%', height: '200px', backgroundColor: '#1a1a1a', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', overflow: 'hidden' }}>
                {producto.imagen_url ? (
                  <img src={producto.imagen_url} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <Package size={48} color="#333" />
                )}
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#00e5ff', fontWeight: 'bold', letterSpacing: '1px' }}>{producto.marca}</span>
                <h4 style={{ margin: '5px 0 10px 0', fontSize: '16px', color: '#fff', lineHeight: '1.4' }}>{producto.nombre}</h4>
                <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', backgroundColor: producto.estado_stock === 'Disponible' ? 'rgba(0, 255, 85, 0.1)' : 'rgba(255, 170, 0, 0.1)', color: producto.estado_stock === 'Disponible' ? '#00ff55' : '#ffaa00', marginBottom: '15px' }}>
                  {producto.estado_stock}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>Bs. {producto.precio}</span>
                <button onClick={() => agregarAlCarrito(producto)} style={{ backgroundColor: 'transparent', border: '1px solid #00e5ff', color: '#00e5ff', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}>
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