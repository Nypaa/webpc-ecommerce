import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import { Menu, Search, MapPin, ShoppingCart, MessageCircle, X, ChevronRight, Trash2, Plus, Minus, FileDown } from 'lucide-react';
import { supabase } from './supabase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import ProductoDetalle from './pages/ProductoDetalle';
import Home from './pages/Home';
import Contacto from './pages/Contacto';
import Categoria from './pages/Categoria';

function MainApp() {
  const navigate = useNavigate();
  // =========================================
  // PALETA DE COLORES Y TEXTURAS (Metal Plomo/Plateado Oscuro)
  // =========================================
  const tema = {
    fondoHeader: 'linear-gradient(rgba(38, 42, 45, 0.88), rgba(20, 22, 24, 0.95)), url("https://www.transparenttextures.com/patterns/brushed-alum-dark.png") #1e2124',
    bordeHeader: '#363b40',
    acentoNeon: '#00f885',
    fondoOscuro: 'linear-gradient(rgba(10, 12, 13, 0.95), rgba(10, 12, 13, 0.95)), url("https://www.transparenttextures.com/patterns/brushed-alum-dark.png") #0a0c0d',

    /* NUEVO: Fondo ultra oscuro para ventanas emergentes */
    fondoModales: 'linear-gradient(rgba(8, 8, 8, 0.97), rgba(4, 4, 4, 0.99)), url("https://www.transparenttextures.com/patterns/brushed-alum-dark.png") #050505'
  };

  const [nombreCliente, setNombreCliente] = useState('');
  const [mostrarUbicaciones, setMostrarUbicaciones] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carritoGamer');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [session, setSession] = useState(null);
  const [mensajeToast, setMensajeToast] = useState(null);

  const cargarProductos = async () => {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error("Error al cargar:", error);
    else setProductos(data);
  };

  useEffect(() => {
    localStorage.setItem('carritoGamer', JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    cargarProductos();
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const categorias = [
    "Procesadores", "Tarjetas Gráficas", "Placas Madre", "Memoria RAM",
    "Almacenamiento", "Fuentes de Poder", "Case / Gabinetes", "Monitores", "Periféricos", "Combos", "Otros"
  ];

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
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
    setMensajeToast(`✅ ${producto.nombre} agregado al carrito`);
    setTimeout(() => setMensajeToast(null), 3000);
  };

  const restarDelCarrito = (id) => setCarrito(carrito.map(item => item.id === id && item.cantidad > 1 ? { ...item, cantidad: parseInt(item.cantidad) - 1 } : item));
  const eliminarDelCarrito = (id) => setCarrito(carrito.filter(item => item.id !== id));

  const modificarCantidadDirecta = (id, valor) => {
    if (valor === '') {
      setCarrito(carrito.map(item => item.id === id ? { ...item, cantidad: '' } : item));
      return;
    }
    const nuevaCantidad = parseInt(valor);
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) return;
    setCarrito(carrito.map(item => item.id === id ? { ...item, cantidad: nuevaCantidad } : item));
  };

  const descargarPDF = () => {
    if (carrito.length === 0) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Cotización - Kiru Tech", 14, 20);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
    if (nombreCliente.trim() !== '') doc.text(`Cliente: ${nombreCliente}`, 14, 38);

    const columnas = ["Producto", "Cant.", "Precio Unit.", "Subtotal"];
    const filas = carrito.map(item => [
      item.nombre, item.cantidad.toString(), `Bs. ${item.precio}`, `Bs. ${item.precio * item.cantidad}`
    ]);

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: nombreCliente.trim() !== '' ? 45 : 40,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 248, 133], textColor: [0, 0, 0] } // Actualizado al nuevo neón
    });

    const finalY = doc.lastAutoTable.finalY || 40;
    doc.setFontSize(14);
    doc.text(`Total a Pagar: Bs. ${precioTotalCarrito}`, 14, finalY + 15);
    doc.save("Cotizacion_KiruTech.pdf");
  };

  const enviarWhatsApp = () => {
    if (carrito.length === 0) return;
    const numeroTienda = "59178777504";
    const lineas = [];
    if (nombreCliente.trim() !== '') lineas.push("Hola, soy *" + nombreCliente + "*. Me interesa concretar la compra de la siguiente cotización:");
    else lineas.push("Hola, me interesa concretar la compra de la siguiente cotización:");
    lineas.push("");
    carrito.forEach(item => {
      lineas.push("- " + item.cantidad + "x " + item.nombre + " - Bs. " + (Number(item.precio) * Number(item.cantidad)));
    });
    lineas.push("");
    lineas.push("*Total a pagar: Bs. " + precioTotalCarrito + "*");
    const textoSeguro = encodeURIComponent(lineas.join('\n'));
    window.open(`https://api.whatsapp.com/send?phone=${numeroTienda}&text=${textoSeguro}`, '_blank');
  };

  const cantidadTotalCarrito = carrito.reduce((total, item) => total + (parseInt(item.cantidad) || 0), 0);
  const precioTotalCarrito = carrito.reduce((total, item) => total + (Number(item.precio) * (Number(item.cantidad) || 0)), 0);

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
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh', margin: 0, fontFamily: '"Rajdhani", sans-serif' }}>

      {/* HEADER PERFECTAMENTE ESTRUCTURADO Y PROTEGIDO */}
      {/* HEADER PERFECTAMENTE ESTRUCTURADO Y PROTEGIDO */}
      <header style={{ background: tema.fondoHeader, borderBottom: `1px solid ${tema.acentoNeon}`, boxShadow: '0px 6px 20px rgba(0, 248, 133, 0.15)', position: 'sticky', top: 0, zIndex: 3000 }}>

        {/* NOTA: Redujimos el padding vertical de 15px a 8px para que el logo toque casi los bordes */}
        {/* NOTA: Padding lateral de 40px para sincronizar exactamente con el main de Home.jsx */}
        <div className="header-contenedor" style={{ padding: '0px 40px', maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>

          {/* 1. LOGO HÍBRIDO (Armadillo Gigante + Tipografía) */}
          <div
            onClick={irAlInicio}
            style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', flexShrink: 0 }}
          >
            {/* A. La cara del Armadillo */}
            <img
              src="https://dugjqlvigojxpzmhiasn.supabase.co/storage/v1/object/public/productos/logosolo1png.png"
              alt="Icono Kiru Tech"
              className="logo-icono-responsive"
              style={{
                height: '100px', /* Lo subimos a 80px para que ocupe todo el alto */
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.5))'
              }}
            />
            {/* B. El texto KIRU TECH */}
            <img
              src="https://dugjqlvigojxpzmhiasn.supabase.co/storage/v1/object/public/productos/kirul1.png"
              alt="Texto Kiru Tech"
              className="logo-texto-responsive"
              style={{
                height: '45px', /* Creció en proporción a la cara */
                objectFit: 'contain',
                display: 'block',
                marginTop: '6px'
              }}
            />
          </div>

          {/* 2. BUSCADOR */}
          <div className="header-buscador-responsive" style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'center', minWidth: '250px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
              <input
                type="text"
                className="buscador-neon"
                placeholder="Buscar componentes, marcas..."
                value={busqueda}
                onChange={(e) => manejarBusqueda(e.target.value)}
                style={{ background: tema.fondoOscuro, border: `1px solid ${tema.bordeHeader}`, color: '#fff', width: '100%', padding: '10px 35px 10px 15px', borderRadius: '20px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
              />
              <Search style={{ color: '#888', position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} size={18} />
            </div>
          </div>

          {/* 3. ICONOS Y CONTACTO */}
          <div className="header-iconos-responsive" style={{ display: 'flex', gap: '18px', alignItems: 'center', flexShrink: 0 }}>
            <span onClick={() => { navigate('/contacto'); window.scrollTo(0, 0); }} style={{ cursor: 'pointer', fontSize: '15px', fontWeight: '500', color: window.location.pathname === '/contacto' ? tema.acentoNeon : '#ccc' }}>
              Contacto
            </span>
            <div style={{ position: 'relative' }}>
              <MapPin style={{ cursor: 'pointer', color: tema.acentoNeon }} size={24} onClick={() => { setMostrarUbicaciones(!mostrarUbicaciones); setMostrarCarrito(false); }} />
            </div>
            <div style={{ cursor: 'pointer', position: 'relative' }} onClick={() => { setMostrarCarrito(!mostrarCarrito); setMostrarUbicaciones(false); }}>
              <ShoppingCart style={{ color: tema.acentoNeon }} size={24} />
              {cantidadTotalCarrito > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-10px', backgroundColor: '#e60000', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '11px', fontWeight: 'bold' }}>{cantidadTotalCarrito}</span>
              )}
            </div>
            <Menu style={{ cursor: 'pointer', color: tema.acentoNeon, marginLeft: '5px' }} size={28} onClick={() => { setMostrarMenu(true); setMostrarCarrito(false); setMostrarUbicaciones(false); }} />
          </div>

        </div>

        {/* MODALES ABSOLUTOS */}
        {(mostrarCarrito || mostrarUbicaciones) && (
          <div onClick={() => { setMostrarCarrito(false); setMostrarUbicaciones(false); }} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 3500 }} />
        )}

        {/* Modal de Ubicaciones */}
        {mostrarUbicaciones && (
          <div style={{ position: 'absolute', top: '70px', right: '20px', background: tema.fondoModales, border: `1px solid ${tema.bordeHeader}`, borderRadius: '8px', padding: '15px', width: '90vw', maxWidth: '280px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', zIndex: 4000 }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: `1px solid ${tema.bordeHeader}`, paddingBottom: '10px' }}>Nuestra Tienda</h4>
            <div style={{ marginBottom: '5px' }}>
              <strong style={{ color: tema.acentoNeon, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={16} /> Kiru Tech Principal
              </strong>
              <p style={{ margin: '5px 0 10px 0', fontSize: '13px', color: '#aaa' }}>Avenida Medardo Chávez 439, Riberalta<br />Atención: Lunes a Sábado</p>
              <a href="https://www.google.com/maps/search/?api=1&query=Avenida+Medardo+Chávez+439,+Riberalta" target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', width: '100%', background: tema.fondoOscuro, color: '#fff', border: `1px solid ${tema.bordeHeader}`, padding: '6px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', textDecoration: 'none', boxSizing: 'border-box' }}>
                Ver ubicación en GPS
              </a>
            </div>
          </div>
        )}

        {/* Modal de Carrito */}
        {mostrarCarrito && (
          <div style={{ position: 'absolute', top: '70px', right: '20px', background: tema.fondoModales, border: `1px solid ${tema.acentoNeon}`, borderRadius: '8px', padding: '20px', width: '90vw', maxWidth: '350px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', zIndex: 4000 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: `1px solid ${tema.bordeHeader}`, paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>Tu Carrito</h3>
              <X style={{ cursor: 'pointer', color: '#aaa' }} size={20} onClick={() => setMostrarCarrito(false)} />
            </div>

            {carrito.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', margin: '30px 0' }}>El carrito está vacío</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '300px', overflowY: 'auto', marginBottom: '15px' }}>
                {carrito.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: tema.fondoOscuro, padding: '10px', borderRadius: '6px', border: `1px solid ${tema.bordeHeader}` }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#fff' }}>{item.nombre}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => restarDelCarrito(item.id)} style={{ background: tema.bordeHeader, border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', padding: '2px 5px' }}><Minus size={12} /></button>
                        <input type="number" min="1" value={item.cantidad} onChange={(e) => modificarCantidadDirecta(item.id, e.target.value)} style={{ width: '45px', textAlign: 'center', background: tema.fondoOscuro, border: `1px solid ${tema.bordeHeader}`, color: '#fff', borderRadius: '4px', fontSize: '14px', outline: 'none', padding: '2px 0' }} />
                        <button onClick={() => agregarAlCarrito(item)} style={{ background: tema.bordeHeader, border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', padding: '2px 5px' }}><Plus size={12} /></button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                      <span style={{ color: tema.acentoNeon, fontWeight: 'bold' }}>Bs. {Number(item.precio) * Number(item.cantidad)}</span>
                      <Trash2 style={{ cursor: 'pointer', color: '#e60000' }} size={16} onClick={() => eliminarDelCarrito(item.id)} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {carrito.length > 0 && (
              <div>
                <div style={{ borderTop: `1px solid ${tema.bordeHeader}`, paddingTop: '15px', marginBottom: '15px' }}>
                  <label style={{ fontSize: '13px', color: '#aaa', display: 'block', marginBottom: '8px' }}>Tus datos (Opcional):</label>
                  <input type="text" placeholder="Ej. Juan Pérez - La Paz" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} style={{ width: '100%', padding: '10px', background: tema.fondoOscuro, border: `1px solid ${tema.bordeHeader}`, color: '#fff', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
                  <span>Total:</span>
                  <span style={{ color: tema.acentoNeon }}>Bs. {precioTotalCarrito}</span>
                </div>
                <button onClick={descargarPDF} style={{ width: '100%', background: tema.bordeHeader, color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <FileDown size={18} /> Descargar Proforma
                </button>
                <button onClick={enviarWhatsApp} style={{ width: '100%', background: tema.acentoNeon, color: '#000', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  <MessageCircle size={18} /> Comprar por WhatsApp
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* MENÚ LATERAL */}
      {mostrarMenu && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '100%', height: '100%', zIndex: 4000, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={() => setMostrarMenu(false)}></div>
          <div style={{ position: 'relative', width: '300px', height: '100%', background: tema.fondoModales, borderLeft: `2px solid ${tema.acentoNeon}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${tema.bordeHeader}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: '0', color: '#fff', fontSize: '18px' }}>Categorías</h3>
              <X style={{ cursor: 'pointer', color: '#aaa' }} size={24} onClick={() => setMostrarMenu(false)} />
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {categorias.map((cat, index) => {
                const rutaSegura = '/categoria/' + encodeURIComponent(cat);
                return (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', paddingBottom: '10px', borderBottom: `1px solid ${tema.bordeHeader}`, color: window.location.pathname === rutaSegura ? tema.acentoNeon : '#ccc' }} onClick={() => { setMostrarMenu(false); setBusqueda(''); navigate(rutaSegura); window.scrollTo(0, 0); }}>
                    <span style={{ fontSize: '15px', fontWeight: window.location.pathname === rutaSegura ? 'bold' : 'normal' }}>{cat}</span>
                    {window.location.pathname === rutaSegura && <ChevronRight size={16} style={{ color: tema.acentoNeon }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ENRUTADOR PRINCIPAL */}
      <Routes>
        <Route path="/" element={<Home busqueda={busqueda} setBusqueda={setBusqueda} productosFiltradosPorBusqueda={productosFiltradosPorBusqueda} productos={productos} agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/categoria/:id" element={<Categoria productos={productos} agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/producto/:id" element={<ProductoDetalle productos={productos} agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/login" element={session ? <Navigate to="/admin" /> : <Login />} />
        <Route path="/admin" element={session ? <Admin productos={productos} recargarProductos={cargarProductos} /> : <Navigate to="/login" />} />
      </Routes>

      {/* TOAST DE NOTIFICACIÓN */}
      {mensajeToast && (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', backgroundColor: tema.acentoNeon, color: '#000', padding: '15px 25px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 10px 30px rgba(0, 229, 255, 0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '10px' }}>
          {mensajeToast}
        </div>
      )}

      {/* PRE-FOOTER (Banner de Confianza) */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', backgroundColor: '#0a0a0a', padding: '40px 20px 10px 20px', boxSizing: 'border-box', marginTop: '20px' }}>
        <img
          src="https://dugjqlvigojxpzmhiasn.supabase.co/storage/v1/object/public/productos/kirufooter.png"
          alt="Beneficios Kiru Tech"
          style={{ width: '100%', maxWidth: '1400px', height: 'auto', borderRadius: '12px', objectFit: 'contain', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
        />
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${tema.bordeHeader}`, padding: '30px 20px', textAlign: 'center', color: '#888', marginTop: '20px', backgroundColor: '#0a0a0a' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '15px' }}>
          © <span onClick={() => { window.scrollTo(0, 0); navigate('/login'); }} style={{ cursor: 'pointer' }}>2026</span> Kiru Tech. Todos los derechos reservados.
        </p>
        <p style={{ fontSize: '13px', margin: 0, color: '#555' }}>Hardware sin límites - Importadores directos de Perú y Brasil</p>
      </footer>

    </div>
  );
}

export default function App() { return <BrowserRouter><MainApp /></BrowserRouter>; }