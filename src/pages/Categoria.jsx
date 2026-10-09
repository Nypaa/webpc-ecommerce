import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, ArrowLeft, Search } from 'lucide-react';

export default function Categoria({ productos, agregarAlCarrito }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Decodificamos el nombre de la URL de forma segura
  const categoriaSeleccionada = decodeURIComponent(id);

  // 2. Estado para el buscador local de la categoría
  const [busquedaLocal, setBusquedaLocal] = useState('');

  // 3. Filtramos TODOS los productos para obtener solo los de esta categoría
  const productosDeCategoria = productos.filter((producto) => producto.categoria === categoriaSeleccionada);

  // 4. Aplicamos el filtro de búsqueda local (si el usuario escribió algo)
  const productosFiltradosLocalmente = productosDeCategoria.filter((producto) => {
    const termino = busquedaLocal.toLowerCase();
    return (
      producto.nombre.toLowerCase().includes(termino) ||
      (producto.marca && producto.marca.toLowerCase().includes(termino))
    );
  });

  return (
    <main style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box', minHeight: '80vh' }}>

      {/* ENCABEZADO DE LA CATEGORÍA Y BUSCADOR LOCAL */}
      <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/')} style={{ backgroundColor: '#1f1f1f', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={20} />
          </button>
          
          <div style={{ flexGrow: 1 }}>
            <h2 style={{ margin: 0, color: '#fff', fontSize: '32px', letterSpacing: '1px' }}>{categoriaSeleccionada}</h2>
            <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '14px' }}>
              {productosFiltradosLocalmente.length} {productosFiltradosLocalmente.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </p>
          </div>

          {/* BUSCADOR LOCAL DE CATEGORÍA */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
            <input
              type="text"
              placeholder={`Buscar en ${categoriaSeleccionada}...`}
              value={busquedaLocal}
              onChange={(e) => setBusquedaLocal(e.target.value)}
              style={{
                backgroundColor: '#141414',
                border: '1px solid #333',
                color: '#fff',
                width: '100%',
                padding: '10px 35px 10px 15px',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '14px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00f885'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
            <Search style={{ color: '#888', position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} size={16} />
          </div>
        </div>
      </div>

      {/* CUADRÍCULA DE PRODUCTOS (Scroll Continuo) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        {productosDeCategoria.length === 0 ? (
          <p style={{ color: '#888', gridColumn: '1 / -1' }}>No hay productos registrados en esta categoría por el momento.</p>
        ) : productosFiltradosLocalmente.length === 0 ? (
          <p style={{ color: '#888', gridColumn: '1 / -1' }}>No se encontraron resultados para "{busquedaLocal}" en esta categoría.</p>
        ) : (
          productosFiltradosLocalmente.map((producto) => (
            <div 
              key={producto.id} 
              className="tarjeta-producto"
              style={{ backgroundColor: '#121a1c', border: '1px solid transparent', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
            >
              <div 
                onClick={() => navigate('/producto/' + producto.id)}
                className="contenedor-imagen-producto"
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  backgroundColor: 'transparent', /* 1. Volvemos a tu fondo original oscuro/transparente */
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  marginBottom: '15px', 
                  cursor: 'pointer' 
                  /* Nota: Ya no hay overflow ni borderRadius en este contenedor */
                }}
              >
                {producto.imagen_url ? (
                  <img 
                    src={producto.imagen_url} 
                    alt={producto.nombre} 
                    style={{ 
                      maxWidth: '100%',     /* 2. EL TRUCO: Solo usa el máximo espacio, no se fuerza al 100% */
                      maxHeight: '100%',    /* 3. La imagen dictará su propio tamaño natural */
                      borderRadius: '8px',  /* 4. Curvamos directamente los píxeles de la imagen */
                      objectFit: 'contain'
                    }} 
                  />
                ) : (
                  <Package size={48} color="#555" /> /* Cambié el gris a #555 para que resalte un poco más sin fondo */
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                
                {/* 1. MARCA (Alineada a la derecha) */}
                <div style={{ textAlign: 'right', marginBottom: '5px' }}>
                  <span style={{ fontSize: '12px', color: '#00f885', fontWeight: 'bold', letterSpacing: '1px' }}>
                    {producto.marca}
                  </span>
                </div>

                {/* NOMBRES DEL PRODUCTO */}
                <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#fff', lineHeight: '1.4' }}>
                  {producto.nombre}
                </h4>

                {/* 2. ESTADO DEL STOCK (Centrado) */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', marginTop: 'auto' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '3px 8px', 
                    borderRadius: '4px', 
                    fontSize: '11px', 
                    fontWeight: 'bold', 
                    backgroundColor: producto.estado_stock === 'Disponible' ? 'rgba(0, 255, 85, 0.1)' : producto.estado_stock === 'Poco Stock' ? 'rgba(255, 170, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)', 
                    color: producto.estado_stock === 'Disponible' ? '#00ff55' : producto.estado_stock === 'Poco Stock' ? '#ffaa00' : '#ff4444' 
                  }}>
                    {producto.estado_stock}
                  </span>
                </div>
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