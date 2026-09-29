import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { LogOut, LayoutDashboard, Plus, Pencil, Trash2, X, Save, Eye } from 'lucide-react';

export default function Admin({ productos, recargarProductos }) {
  const navigate = useNavigate();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '', marca: '', categoria: 'Procesadores', precio: '', estado_stock: 'Disponible', imagen_url: ''
  });

  const categorias = ["Procesadores", "Tarjetas Gráficas", "Placas Madre", "Memoria RAM", "Almacenamiento", "Fuentes de Poder", "Case / Gabinetes", "Monitores", "Periféricos"];

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const abrirFormularioNuevo = () => {
    setFormData({ nombre: '', marca: '', categoria: 'Procesadores', precio: '', estado_stock: 'Disponible', imagen_url: '' });
    setEditandoId(null);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const abrirFormularioEditar = (producto) => {
    setFormData({
      nombre: producto.nombre,
      marca: producto.marca,
      categoria: producto.categoria,
      precio: producto.precio,
      estado_stock: producto.estado_stock,
      imagen_url: producto.imagen_url || ''
    });
    setEditandoId(producto.id);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto de la tienda? Esta acción no se puede deshacer.')) {
      await supabase.from('productos').delete().eq('id', id);
      recargarProductos();
    }
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    
    const datosGuardar = {
      nombre: formData.nombre,
      marca: formData.marca,
      categoria: formData.categoria,
      precio: parseFloat(formData.precio),
      estado_stock: formData.estado_stock,
      imagen_url: formData.imagen_url
    };

    if (editandoId) {
      await supabase.from('productos').update(datosGuardar).eq('id', editandoId);
    } else {
      await supabase.from('productos').insert([datosGuardar]);
    }
    
    await recargarProductos();
    setMostrarFormulario(false);
    setCargando(false);
  };

  return (
    <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LayoutDashboard size={28} color="#00e5ff" /> Panel de Control
        </h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => navigate('/')} style={{ backgroundColor: 'transparent', border: '1px solid #00e5ff', color: '#00e5ff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} /> Ver Tienda
          </button>
          <button onClick={cerrarSesion} style={{ backgroundColor: '#1f1f1f', border: '1px solid #e60000', color: '#e60000', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
            <LogOut size={18} /> Salir
          </button>
        </div>
      </div>

      {mostrarFormulario && (
        <div style={{ backgroundColor: '#1f1f1f', padding: '30px', borderRadius: '12px', border: '1px solid #00e5ff', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,229,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#fff' }}>{editandoId ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
            <X size={24} color="#aaa" style={{ cursor: 'pointer' }} onClick={() => setMostrarFormulario(false)} />
          </div>
          <form onSubmit={manejarSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Nombre del producto</label>
              <input required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#141414', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Marca</label>
              <input required value={formData.marca} onChange={(e) => setFormData({...formData, marca: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#141414', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Categoría</label>
              <select value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#141414', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }}>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Precio (Bs.)</label>
              <input type="number" required value={formData.precio} onChange={(e) => setFormData({...formData, precio: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#141414', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Estado de Stock</label>
              <select value={formData.estado_stock} onChange={(e) => setFormData({...formData, estado_stock: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#141414', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }}>
                <option value="Disponible">Disponible</option>
                <option value="Poco Stock">Poco Stock</option>
                <option value="Agotado">Agotado</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' }}>URL de Imagen (opcional)</label>
              <input value={formData.imagen_url} onChange={(e) => setFormData({...formData, imagen_url: e.target.value})} placeholder="https://..." style={{ width: '100%', padding: '12px', backgroundColor: '#141414', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '10px' }}>
              <button type="button" onClick={() => setMostrarFormulario(false)} style={{ padding: '12px 24px', backgroundColor: 'transparent', color: '#aaa', border: '1px solid #555', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cancelar
              </button>
              <button type="submit" disabled={cargando} style={{ padding: '12px 24px', backgroundColor: '#00e5ff', color: '#000', border: 'none', borderRadius: '6px', cursor: cargando ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Save size={18} /> {cargando ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ backgroundColor: '#141414', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', backgroundColor: '#1a1a1a' }}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '20px' }}>Inventario de Tienda ({productos.length})</h3>
          <button onClick={abrirFormularioNuevo} style={{ backgroundColor: '#00e5ff', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
            <Plus size={18} /> Agregar Nuevo
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#111', borderBottom: '1px solid #333' }}>
                <th style={{ padding: '15px 30px', color: '#888', fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px' }}>PRODUCTO</th>
                <th style={{ padding: '15px 30px', color: '#888', fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px' }}>CATEGORÍA</th>
                <th style={{ padding: '15px 30px', color: '#888', fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px' }}>PRECIO</th>
                <th style={{ padding: '15px 30px', color: '#888', fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px' }}>ESTADO</th>
                <th style={{ padding: '15px 30px', color: '#888', fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px', textAlign: 'right' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px 30px', color: '#fff' }}>
                    <div style={{ fontWeight: 'bold' }}>{p.nombre}</div>
                    <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>{p.marca}</div>
                  </td>
                  <td style={{ padding: '15px 30px', color: '#aaa', fontSize: '14px' }}>{p.categoria}</td>
                  <td style={{ padding: '15px 30px', color: '#00e5ff', fontWeight: 'bold' }}>Bs. {p.precio}</td>
                  <td style={{ padding: '15px 30px' }}>
                    <span style={{ fontSize: '12px', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold', backgroundColor: p.estado_stock === 'Disponible' ? 'rgba(0, 255, 85, 0.1)' : p.estado_stock === 'Poco Stock' ? 'rgba(255, 170, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)', color: p.estado_stock === 'Disponible' ? '#00ff55' : p.estado_stock === 'Poco Stock' ? '#ffaa00' : '#ff4444' }}>
                      {p.estado_stock}
                    </span>
                  </td>
                  <td style={{ padding: '15px 30px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button onClick={() => abrirFormularioEditar(p)} style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#00e5ff', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => eliminarProducto(p.id)} style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#ff4444', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}