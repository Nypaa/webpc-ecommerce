import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Categoria({ productos, agregarAlCarrito }) {
  const { id } = useParams();

  // 1. Decodificamos el nombre de la URL de forma segura
  const categoriaSeleccionada = decodeURIComponent(id);

  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 12;

  // 2. CORRECCIÓN: Filtramos usando 'categoriaSeleccionada', NO 'id'
  const productosDeCategoria = productos.filter((producto) => producto.categoria === categoriaSeleccionada);

  useEffect(() => {
    setPaginaActual(1);
  }, [categoriaSeleccionada]); // Actualizamos la página si cambia la categoría

  const indiceUltimoProducto = paginaActual * productosPorPagina;
  const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
  const productosActuales = productosDeCategoria.slice(indicePrimerProducto, indiceUltimoProducto);

  const totalPaginas = Math.ceil(productosDeCategoria.length / productosPorPagina);

  const irPaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const irPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box', minHeight: '80vh' }}>

      <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button onClick={() => navigate('/')} style={{ backgroundColor: '#1f1f1f', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          {/* 3. CORRECCIÓN: Mostramos el nombre decodificado en el título */}
          <h2 style={{ margin: 0, color: '#fff', fontSize: '32px', letterSpacing: '1px' }}>{categoriaSeleccionada}</h2>
          <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '14px' }}>{productosDeCategoria.length} productos disponibles</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        {productosDeCategoria.length === 0 ? (
          <p style={{ color: '#888', gridColumn: '1 / -1' }}>No hay productos registrados en esta categoría por el momento.</p>
        ) : (
          productosActuales.map((producto) => (
            <div key={producto.id} style={{ backgroundColor: '#141414', border: '1px solid #222', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div
                onClick={() => navigate('/producto/' + producto.id)}
                style={{ width: '100%', height: '200px', backgroundColor: '#1a1a1a', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', overflow: 'hidden', cursor: 'pointer' }}
              >
                {producto.imagen_url ? (
                  <img src={producto.imagen_url} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <Package size={48} color="#333" />
                )}
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#00e5ff', fontWeight: 'bold', letterSpacing: '1px' }}>{producto.marca}</span>
                
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
                    borderColor: producto.estado_stock === 'Agotado' ? '#333' : '#00e5ff',
                    color: producto.estado_stock === 'Agotado' ? '#555' : '#00e5ff',
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

      {totalPaginas > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px', gap: '20px' }}>
          <button onClick={irPaginaAnterior} disabled={paginaActual === 1} style={{ backgroundColor: paginaActual === 1 ? 'transparent' : '#1f1f1f', color: paginaActual === 1 ? '#555' : '#00e5ff', border: '1px solid', borderColor: paginaActual === 1 ? '#333' : '#00e5ff', padding: '10px 20px', borderRadius: '8px', cursor: paginaActual === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', transition: 'all 0.2s' }}>
            <ChevronLeft size={18} /> Anterior
          </button>
          <span style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold', letterSpacing: '1px' }}>Página {paginaActual} de {totalPaginas}</span>
          <button onClick={irPaginaSiguiente} disabled={paginaActual === totalPaginas} style={{ backgroundColor: paginaActual === totalPaginas ? 'transparent' : '#1f1f1f', color: paginaActual === totalPaginas ? '#555' : '#00e5ff', border: '1px solid', borderColor: paginaActual === totalPaginas ? '#333' : '#00e5ff', padding: '10px 20px', borderRadius: '8px', cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', transition: 'all 0.2s' }}>
            Siguiente <ChevronRight size={18} />
          </button>
        </div>
      )}

    </main>
  );
}