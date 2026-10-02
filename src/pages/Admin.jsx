import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { LogOut, LayoutDashboard, Plus, Pencil, Trash2, X, Save, Eye, Upload, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Admin({ productos, recargarProductos }) {
  const navigate = useNavigate();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [imagenArchivo, setImagenArchivo] = useState(null);

  // NUEVOS ESTADOS PARA BÚSQUEDA Y PAGINACIÓN
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 15;

  const [formData, setFormData] = useState({
    nombre: '', marca: '', categoria: 'Procesadores', precio: '', estado_stock: 'Disponible', imagen_url: '', descripcion: ''
  });

  const categorias = ["Procesadores", "Tarjetas Gráficas", "Placas Madre", "Memoria RAM", "Almacenamiento", "Fuentes de Poder", "Case / Gabinetes", "Monitores", "Periféricos"];

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const abrirFormularioNuevo = () => {
    setFormData({ nombre: '', marca: '', categoria: 'Procesadores', precio: '', estado_stock: 'Disponible', imagen_url: '' });
    setImagenArchivo(null);
    setEditandoId(null);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const abrirFormularioEditar = (producto) => {
    setFormData({
      nombre: producto.nombre, marca: producto.marca, categoria: producto.categoria, 
      precio: producto.precio, estado_stock: producto.estado_stock, imagen_url: producto.imagen_url || '',
      descripcion: producto.descripcion || ''
    });
    setImagenArchivo(null);
    setEditandoId(producto.id);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      await supabase.from('productos').delete().eq('id', id);
      recargarProductos();
    }
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    let urlImagenFinal = formData.imagen_url;

    if (imagenArchivo) {
      const nombreArchivo = Date.now() + '' + imagenArchivo.name.replace(/\s+/g, '');
      const { error: uploadError } = await supabase.storage.from('productos').upload(nombreArchivo, imagenArchivo);
      if (uploadError) {
        alert("Error al subir la imagen.");
        setCargando(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from('productos').getPublicUrl(nombreArchivo);
      urlImagenFinal = publicUrlData.publicUrl;
    }

    const datosGuardar = {
      nombre: formData.nombre, marca: formData.marca, categoria: formData.categoria,
      precio: parseFloat(formData.precio), estado_stock: formData.estado_stock, imagen_url: urlImagenFinal, descripcion: formData.descripcion
    };

    if (editandoId) {
      await supabase.from('productos').update(datosGuardar).eq('id', editandoId);
    } else {
      await supabase.from('productos').insert([datosGuardar]);
    }
    
    await recargarProductos();
    setMostrarFormulario(false);
    setCargando(false);
    setPaginaActual(1); // Regresar a la página 1 al guardar algo nuevo
  };

  // --- EMBUDO DE DATOS (PIPELINE): Ordenar -> Filtrar -> Paginar ---
  
  // 1. ORDEN ESTRICTO: Los más nuevos arriba (ID mayor)
 // 1. ORDEN ESTRICTO: Los más nuevos arriba usando la fecha real
  const productosOrdenados = [...productos].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // 2. FILTROS: Aplicar búsqueda y categoría
  const productosFiltrados = productosOrdenados.filter(p => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.marca.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria === 'Todas' || p.categoria === filtroCategoria;
    return coincideBusqueda && coincideCategoria;
  });

  // 3. PAGINACIÓN: Cortar el array para mostrar solo 15
  const indiceUltimoProducto = paginaActual * productosPorPagina;
  const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);
  
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  return (
    <main style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box' }}>
      {/* HEADER (Sin cambios) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px', gap: '15px' }}>
        <h1 style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px' }}>
          <LayoutDashboard size={28} color="#00e5ff" /> Panel de Control
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/')} style={{ backgroundColor: 'transparent', border: '1px solid #00e5ff', color: '#00e5ff', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} /> Ver Tienda
          </button>
          <button onClick={cerrarSesion} style={{ backgroundColor: '#1f1f1f', border: '1px solid #e60000', color: '#e60000', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
            <LogOut size={18} /> Salir
          </button>
        </div>
      </div>

      {/* FORMULARIO CRUD (Oculto por defecto) */}
      {mostrarFormulario && (
        <div style={{ backgroundColor: '#1f1f1f', padding: '25px', borderRadius: '12px', border: '1px solid #00e5ff', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,229,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#fff' }}>{editandoId ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
            <X size={24} color="#aaa" style={{ cursor: 'pointer' }} onClick={() => setMostrarFormulario(false)} />
          </div>
          <form onSubmit={manejarSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {/* ... (Todos tus inputs del formulario se mantienen igual aquí) ... */}
            <div><label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Nombre</label><input required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} style={{ width: '100%', padding: '10px', backgroundColor: '#141414', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none' }} /></div>
            <div><label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Marca</label><input required value={formData.marca} onChange={(e) => setFormData({...formData, marca: e.target.value})} style={{ width: '100%', padding: '10px', backgroundColor: '#141414', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none' }} /></div>
            <div>
              <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Categoría</label>
              <select value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} style={{ width: '100%', padding: '10px', backgroundColor: '#141414', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none' }}>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Precio (Bs.)</label><input type="number" required value={formData.precio} onChange={(e) => setFormData({...formData, precio: e.target.value})} style={{ width: '100%', padding: '10px', backgroundColor: '#141414', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none' }} /></div>
            <div>
              <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Estado</label>
              <select value={formData.estado_stock} onChange={(e) => setFormData({...formData, estado_stock: e.target.value})} style={{ width: '100%', padding: '10px', backgroundColor: '#141414', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none' }}>
                <option value="Disponible">Disponible</option><option value="Poco Stock">Poco Stock</option><option value="Agotado">Agotado</option>
              </select>
            </div>

            
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Descripción / Especificaciones</label>
              <textarea 
                value={formData.descripcion} 
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})} 
                placeholder="Ej: 8GB DDR4 3200MHz, Latencia CL16..."
                style={{ width: '100%', padding: '10px', backgroundColor: '#141414', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }} 
              />
            </div>


           <div>
          <label style={{ fontSize: '13px', color: '#aaa', display: 'block', marginBottom: '8px' }}>Subir Imagen</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
            <label style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '8px', 
              backgroundColor: '#1f1f1f', color: '#fff', border: '1px solid #333', 
              padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', 
              fontSize: '14px', transition: 'all 0.2s' 
            }}>
              <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {imagenArchivo ? '✅ ${imagenArchivo.name}' : '📸 Elegir archivo...'}
              </span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImagenArchivo(e.target.files[0])}
                style={{ display: 'none' }} 
              />
            </label>
            
            {/* Aquí recuperamos tu enlace original para ver la foto */}
            {formData.imagen_url && !imagenArchivo && (
              <a 
                href={formData.imagen_url} 
                target="_blank" 
                rel="noreferrer" 
                style={{ fontSize: '12px', color: '#00e5ff', textDecoration: 'underline' }}
              >
                Ver foto guardada
              </a>
            )}
          </div>
        </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '10px' }}>
              <button type="button" onClick={() => setMostrarFormulario(false)} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#aaa', border: '1px solid #555', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              <button type="submit" disabled={cargando} style={{ padding: '10px 20px', backgroundColor: '#00e5ff', color: '#000', border: 'none', borderRadius: '6px', cursor: cargando ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Save size={18} /> {cargando ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECCIÓN DE INVENTARIO CON FILTROS Y PAGINACIÓN */}
      <div style={{ backgroundColor: '#141414', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
        
        {/* BARRA DE HERRAMIENTAS (Search, Filter, Agregar) */}
        <div style={{ padding: '20px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #222', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', flex: 1 }}>
            
            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <Search size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '10px' }} />
              <input 
                type="text" 
                placeholder="Buscar por nombre o marca..." 
                value={busqueda}
                onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                style={{ width: '100%', padding: '10px 10px 10px 38px', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <Filter size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '10px' }} />
              <select 
                value={filtroCategoria}
                onChange={(e) => { setFiltroCategoria(e.target.value); setPaginaActual(1); }}
                style={{ width: '100%', padding: '10px 10px 10px 38px', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', appearance: 'none' }}
              >
                <option value="Todas">Todas las categorías</option>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <button onClick={abrirFormularioNuevo} style={{ backgroundColor: '#00e5ff', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <Plus size={18} /> Agregar Nuevo
          </button>
        </div>
        
        {/* TABLA */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ backgroundColor: '#111', borderBottom: '1px solid #333' }}>
                <th style={{ padding: '15px 20px', color: '#888', fontSize: '13px' }}>PRODUCTO</th>
                <th style={{ padding: '15px 20px', color: '#888', fontSize: '13px' }}>CATEGORÍA</th>
                <th style={{ padding: '15px 20px', color: '#888', fontSize: '13px' }}>PRECIO</th>
                <th style={{ padding: '15px 20px', color: '#888', fontSize: '13px' }}>ESTADO</th>
                <th style={{ padding: '15px 20px', color: '#888', fontSize: '13px', textAlign: 'right' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {productosPaginados.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No se encontraron productos.</td></tr>
              ) : (
                productosPaginados.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '12px 20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#222', flexShrink: 0 }}>
                        {p.imagen_url && <img src={p.imagen_url} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{p.nombre}</div>
                        <div style={{ fontSize: '12px', color: '#555' }}>{p.marca}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px', color: '#aaa', fontSize: '13px' }}>{p.categoria}</td>
                    <td style={{ padding: '12px 20px', color: '#00e5ff', fontWeight: 'bold', fontSize: '14px' }}>Bs. {p.precio}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', backgroundColor: p.estado_stock === 'Disponible' ? 'rgba(0, 255, 85, 0.1)' : p.estado_stock === 'Poco Stock' ? 'rgba(255, 170, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)', color: p.estado_stock === 'Disponible' ? '#00ff55' : p.estado_stock === 'Poco Stock' ? '#ffaa00' : '#ff4444' }}>
                        {p.estado_stock}
                      </span>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button onClick={() => abrirFormularioEditar(p)} style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#00e5ff', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><Pencil size={16} /></button>
                        <button onClick={() => eliminarProducto(p.id)} style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#ff4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* CONTROLES DE PAGINACIÓN */}
        {totalPaginas > 1 && (
          <div style={{ padding: '15px 20px', backgroundColor: '#1a1a1a', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#888', fontSize: '13px' }}>
              Mostrando {indicePrimerProducto + 1} al {Math.min(indiceUltimoProducto, productosFiltrados.length)} de {productosFiltrados.length} productos
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
                style={{ backgroundColor: paginaActual === 1 ? '#111' : '#222', color: paginaActual === 1 ? '#555' : '#fff', border: '1px solid #333', padding: '6px 12px', borderRadius: '6px', cursor: paginaActual === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <ChevronLeft size={16} /> Anterior
              </button>
              <button 
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
                style={{ backgroundColor: paginaActual === totalPaginas ? '#111' : '#222', color: paginaActual === totalPaginas ? '#555' : '#fff', border: '1px solid #333', padding: '6px 12px', borderRadius: '6px', cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
              >
                Siguiente <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}