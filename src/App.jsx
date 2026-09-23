import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Menu, Search, MapPin, ShoppingCart, MessageCircle, X, ChevronRight, Trash2, Plus, Minus, FileDown } from 'lucide-react';
import { supabase } from './supabase'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import Home from './pages/Home';
import Contacto from './pages/Contacto';
import Categoria from './pages/Categoria'; // NUEVA PÁGINA

function MainApp() {
  const navigate = useNavigate();

  const [mostrarUbicaciones, setMostrarUbicaciones] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [productos, setProductos] = useState([]);
  
  const [busqueda, setBusqueda] = useState(''); // El buscador es el único filtro global ahora
  
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  useEffect(() => {
    async function cargarProductos() {
      const { data, error } = await supabase.from('productos').select('*');
      if (error) console.error("Error al cargar:", error);
      else setProductos(data);
    }
    cargarProductos();
  }, []);

  const categorias = [
    "Procesadores", "Tarjetas Gráficas", "Placas Madre", "Memoria RAM", 
    "Almacenamiento", "Fuentes de Poder", "Case / Gabinetes", "Monitores", "Periféricos"
  ];

  // Filtro exclusivo para la barra de búsqueda de la cabecera
  const productosFiltradosPorBusqueda = productos.filter((producto) => {
    const termino = busqueda.toLowerCase();
    return producto.nombre.toLowerCase().includes(termino) ||
      (producto.marca && producto.marca.toLowerCase().includes(termino)) ||
      (producto.categoria && producto.categoria.toLowerCase().includes(termino));
  });

  const agregarAlCarrito = (producto) => {
    const itemExistente = carrito.find(item => item.id === producto.id);
    if (itemExistente) {
      setCarrito(carrito.map(item => item.id === producto.id ? { ...item, cantidad: (parseInt(item.cantidad) || 0) + 1 } : item));
    } else setCarrito([...carrito, { ...producto, cantidad: 1 }]);
  };
  const restarDelCarrito = (id) => setCarrito(carrito.map(item => item.id === id && item.cantidad > 1 ? { ...item, cantidad: parseInt(item.cantidad) - 1 } : item));
  const editarCantidad = (id, valor) => setCarrito(carrito.map(item => item.id === id ? { ...item, cantidad: valor === '' ? '' : parseInt(valor) || 1 } : item));
  const eliminarDelCarrito = (id) => setCarrito(carrito.filter(item => item.id !== id));

  const descargarPDF = () => { /* Código del PDF conservado (sin cambios por brevedad, asegúrate de mantenerlo) */ };
  const enviarWhatsApp = () => { /* Código WhatsApp conservado (sin cambios) */ };
  
  const cantidadTotalCarrito = carrito.reduce((total, item) => total + (parseInt(item.cantidad) || 0), 0);
  const precioTotalCarrito = carrito.reduce((total, item) => total + (item.precio * (parseInt(item.cantidad) || 0)), 0);

  const irAlInicio = () => {
    setBusqueda('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/');
  };

  const manejarBusqueda = (texto) => {
    setBusqueda(texto);
    if (window.location.pathname !== '/') navigate('/'); 
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh', margin: 0, fontFamily: 'system-ui, sans-serif' }}>
      
      <header style={{ position: 'sticky', top: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: '#141414', borderBottom: '1px solid #222' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Menu style={{ cursor: 'pointer', color: '#00e5ff' }} size={28} onClick={() => setMostrarMenu(true)} />
          <h2 onClick={irAlInicio} style={{ margin: 0, color: '#ffffff', letterSpacing: '1px', fontSize: '24px', cursor: 'pointer' }}>
            web<span style={{ color: '#00e5ff' }}>PC</span>
          </h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1f1f1f', borderRadius: '8px', padding: '8px 15px', width: '45%', border: '1px solid #333' }}>
          <input type="text" placeholder="Buscar productos..." value={busqueda} onChange={(e) => manejarBusqueda(e.target.value)} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '15px' }} />
          <Search style={{ color: '#888', cursor: 'pointer' }} size={20} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <span onClick={() => { navigate('/contacto'); window.scrollTo(0,0); }} style={{ cursor: 'pointer', fontSize: '15px', fontWeight: '500', color: window.location.pathname === '/contacto' ? '#00e5ff' : '#ccc' }}>Contacto</span>
          
          <MapPin style={{ cursor: 'pointer', color: '#00e5ff' }} size={24} onClick={() => { setMostrarUbicaciones(!mostrarUbicaciones); setMostrarCarrito(false); }} />
          
          <div style={{ position: 'relative' }}>
            <div style={{ cursor: 'pointer', position: 'relative' }} onClick={() => { setMostrarCarrito(!mostrarCarrito); setMostrarUbicaciones(false); }}>
              <ShoppingCart style={{ color: '#00e5ff' }} size={26} />
              <span style={{ position: 'absolute', top: '-8px', right: '-10px', backgroundColor: '#e60000', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', fontWeight: 'bold' }}>{cantidadTotalCarrito}</span>
            </div>
            {/* Mantén aquí la estructura de tu carrito de compras anterior */}
          </div>
        </div>
      </header>

      {/* NUEVO MENÚ LATERAL ENRUTADOR */}
      {mostrarMenu && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 4000, display: 'flex' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={() => setMostrarMenu(false)}></div>
          <div style={{ position: 'relative', width: '300px', height: '100%', backgroundColor: '#141414', borderRight: '1px solid #00e5ff', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: '0', color: '#fff', fontSize: '18px' }}>Categorías</h3>
              <X style={{ cursor: 'pointer', color: '#aaa' }} size={24} onClick={() => setMostrarMenu(false)} />
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {categorias.map((cat, index) => (
                <div 
                  key={index} 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', paddingBottom: '10px', borderBottom: '1px solid #222', color: window.location.pathname === `/categoria/${cat}` ? '#00e5ff' : '#ccc' }} 
                  onClick={() => { 
                    setMostrarMenu(false); 
                    setBusqueda(''); 
                    navigate(`/categoria/${cat}`); // NAVEGACIÓN REAL
                    window.scrollTo(0,0);
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: window.location.pathname === `/categoria/${cat}` ? 'bold' : 'normal' }}>{cat}</span>
                  {window.location.pathname === `/categoria/${cat}` && <ChevronRight size={16} style={{ color: '#00e5ff' }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ENRUTADOR PRINCIPAL */}
      <Routes>
        <Route path="/" element={<Home busqueda={busqueda} setBusqueda={setBusqueda} productosFiltradosPorBusqueda={productosFiltradosPorBusqueda} productos={productos} agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/contacto" element={<Contacto />} />
        {/* NUEVA RUTA DINÁMICAA */}
        <Route path="/categoria/:id" element={<Categoria productos={productos} agregarAlCarrito={agregarAlCarrito} />} />
      </Routes>
      
    </div>
  );
}

export default function App() { return <BrowserRouter><MainApp /></BrowserRouter>; }