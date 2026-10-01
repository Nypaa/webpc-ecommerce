import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
// ...tus otros imports
import Login from './pages/Login';
import Admin from './pages/Admin';
import { Menu, Search, MapPin, ShoppingCart, MessageCircle, X, ChevronRight, Trash2, Plus, Minus, FileDown } from 'lucide-react';
import { supabase } from './supabase'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import ProductoDetalle from './pages/ProductoDetalle';

import Home from './pages/Home';
import Contacto from './pages/Contacto';
import Categoria from './pages/Categoria'; // NUEVA PÁGINA

function MainApp() {
  const navigate = useNavigate();

  const [mostrarUbicaciones, setMostrarUbicaciones] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [productos, setProductos] = useState([]);
  
  const [busqueda, setBusqueda] = useState(''); // El buscador es el único filtro global ahora
  
  // Al iniciar, preguntamos si hay un carrito guardado en el navegador. Si no hay, iniciamos vacío.
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carritoGamer');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [session, setSession] = useState(null);
  const [mensajeToast, setMensajeToast] = useState(null);


  // 1. Convertimos la carga en una función global y ordenamos los productos nuevos primero
  const cargarProductos = async () => {
    // CAMBIAMOS .order('id') POR .order('created_at')
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) console.error("Error al cargar:", error);
    else setProductos(data);
  };
  useEffect(() => {
    // Cada vez que 'carrito' cambie, lo guardamos convertido en texto
    localStorage.setItem('carritoGamer', JSON.stringify(carrito));
  }, [carrito]);

  // 2. El useEffect ahora solo "llama" a la función al iniciar
  useEffect(() => {
    cargarProductos();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
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
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
    
    // Lógica de la notificación
    setMensajeToast(`✅ ${producto.nombre} agregado al carrito`);
    setTimeout(() => {
      setMensajeToast(null);
    }, 3000); // El cartel desaparece solo a los 3 segundos
  };

  const restarDelCarrito = (id) => setCarrito(carrito.map(item => item.id === id && item.cantidad > 1 ? { ...item, cantidad: parseInt(item.cantidad) - 1 } : item));
  const editarCantidad = (id, valor) => setCarrito(carrito.map(item => item.id === id ? { ...item, cantidad: valor === '' ? '' : parseInt(valor) || 1 } : item));
  const eliminarDelCarrito = (id) => setCarrito(carrito.filter(item => item.id !== id));

  const descargarPDF = () => {
    if (carrito.length === 0) return;
    
    const doc = new jsPDF();
    
    // Título y fecha
    doc.setFontSize(22);
    doc.text("Cotización - webPC", 14, 20);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Preparar los datos para la tabla
    const columnas = ["Producto", "Cant.", "Precio Unit.", "Subtotal"];
    const filas = carrito.map(item => [
      item.nombre,
      item.cantidad.toString(),
      `Bs. ${item.precio}`,
      `Bs. ${item.precio * item.cantidad}`
    ]);
    
    // Generar la tabla
    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 229, 255], textColor: [0, 0, 0] }
    });
    
    // Total final
    const finalY = doc.lastAutoTable.finalY || 40;
    doc.setFontSize(14);
    doc.text(`Total a Pagar: Bs. ${precioTotalCarrito}`, 14, finalY + 15);
    
    // Descargar el archivo
    doc.save("Cotizacion_webPC.pdf");
  };

  const enviarWhatsApp = () => {
    if (carrito.length === 0) return;
    
    // IMPORTANTE: Pon tu número real aquí (Ejemplo Bolivia: 59170000000)
    const numeroTienda = "59100000000"; 
    
    // 1. Creamos una lista (Array) con cada línea del mensaje
    const lineas = [];
    lineas.push("Hola, me interesa concretar la compra de la siguiente cotización:");
    lineas.push(""); // Salto de línea
    
    carrito.forEach(item => {
      // Usamos un guion normal en lugar del símbolo especial
      lineas.push("- " + item.cantidad + "x " + item.nombre + " - Bs. " + (Number(item.precio) * Number(item.cantidad)));
    });
    
    lineas.push(""); // Salto de línea
    lineas.push("*Total a pagar: Bs. " + precioTotalCarrito + "*");
    
    // 2. Unimos todas las líneas con el salto universal
    const mensajeUnido = lineas.join('\n');
    
    // 3. Lo traducimos a lenguaje de internet
    const textoSeguro = encodeURIComponent(mensajeUnido);
    
    const url = 'https://api.whatsapp.com/send?phone=' + numeroTienda + '&text=' + textoSeguro;
    
    window.open(url, '_blank');
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
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh', margin: 0, fontFamily: 'system-ui, sans-serif' }}>
      
      <header style={{ position: 'sticky', top: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: '#141414', borderBottom: '1px solid #222' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Menu style={{ cursor: 'pointer', color: '#00e5ff' }} size={28} onClick={() => { setMostrarMenu(true); setMostrarCarrito(false); setMostrarUbicaciones(false); }} />
          <h2 onClick={irAlInicio} style={{ margin: 0, color: '#ffffff', letterSpacing: '1px', fontSize: '24px', cursor: 'pointer' }}>
            web<span style={{ color: '#00e5ff' }}>PC</span>
          </h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1f1f1f', borderRadius: '8px', padding: '8px 15px', width: '45%', border: '1px solid #333' }}>
          <input type="text" placeholder="Buscar productos..." value={busqueda} onChange={(e) => manejarBusqueda(e.target.value)} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '15px' }} />
          <Search style={{ color: '#888', cursor: 'pointer' }} size={20} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          
          {/* ESCUDO INVISIBLE QUE ATRAPA LOS CLICS AFUERA */}
          {(mostrarCarrito || mostrarUbicaciones) && (
            <div 
              onClick={() => { setMostrarCarrito(false); setMostrarUbicaciones(false); }}
              style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 3500 }}
            />
          )}

          <span onClick={() => { navigate('/contacto'); window.scrollTo(0,0); }} style={{ cursor: 'pointer', fontSize: '15px', fontWeight: '500', color: window.location.pathname === '/contacto' ? '#00e5ff' : '#ccc', position: 'relative', zIndex: 4000 }}>Contacto</span>
          
          {/* BOTÓN Y MENÚ DE UBICACIÓN */}
          <div style={{ position: 'relative', zIndex: 4000 }}>
            <MapPin style={{ cursor: 'pointer', color: '#00e5ff' }} size={24} onClick={() => { setMostrarUbicaciones(!mostrarUbicaciones); setMostrarCarrito(false); }} />
            
            {mostrarUbicaciones && (
              <div style={{ position: 'absolute', top: '40px', right: '-50px', backgroundColor: '#1f1f1f', border: '1px solid #333', borderRadius: '8px', padding: '15px', width: '90vw', maxWidth: '280px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Nuestras Sucursales</h4>
                
                <div style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#00e5ff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={16}/> Sede Central
                  </strong>
                  <p style={{ margin: '5px 0 10px 0', fontSize: '13px', color: '#aaa' }}>Av. Principal 123, Ciudad<br/>Lun - Vie: 9:00 a 19:00</p>
                  <button onClick={() => window.open('https://maps.google.com', '_blank')} style={{ width: '100%', backgroundColor: '#222', color: '#fff', border: '1px solid #444', padding: '6px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    Ver en Google Maps
                  </button>
                </div>
                
                <div>
                  <strong style={{ color: '#00e5ff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={16}/> Sucursal Norte
                  </strong>
                  <p style={{ margin: '5px 0 10px 0', fontSize: '13px', color: '#aaa' }}>Centro C. Norte, Local 45<br/>Lun - Sab: 10:00 a 20:00</p>
                  <button onClick={() => window.open('https://maps.google.com', '_blank')} style={{ width: '100%', backgroundColor: '#222', color: '#fff', border: '1px solid #444', padding: '6px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    Ver en Google Maps
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* BOTÓN Y MENÚ DEL CARRITO */}
          <div style={{ position: 'relative', zIndex: 4000 }}>
            <div style={{ cursor: 'pointer', position: 'relative' }} onClick={() => { setMostrarCarrito(!mostrarCarrito); setMostrarUbicaciones(false); }}>
              <ShoppingCart style={{ color: '#00e5ff' }} size={26} />
              {cantidadTotalCarrito > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-10px', backgroundColor: '#e60000', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', fontWeight: 'bold' }}>
                  {cantidadTotalCarrito}
                </span>
              )}
            </div>
            
              {mostrarCarrito && (
              <div style={{ position: 'absolute', top: '40px', right: '0', backgroundColor: '#141414', border: '1px solid #00e5ff', borderRadius: '8px', padding: '20px', width: '90vw', maxWidth: '350px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                  <h3 style={{ margin: 0, color: '#fff' }}>Tu Carrito</h3>
                  <X style={{ cursor: 'pointer', color: '#aaa' }} size={20} onClick={() => setMostrarCarrito(false)} />
                </div>
                
                {carrito.length === 0 ? (
                  <p style={{ color: '#888', textAlign: 'center', margin: '30px 0' }}>El carrito está vacío</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '300px', overflowY: 'auto', marginBottom: '15px' }}>
                    {carrito.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#fff' }}>{item.nombre}</h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button onClick={() => restarDelCarrito(item.id)} style={{ background: '#333', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', padding: '2px 5px' }}><Minus size={12} /></button>
                            <span style={{ fontSize: '14px', color: '#fff' }}>{item.cantidad}</span>
                            <button onClick={() => agregarAlCarrito(item)} style={{ background: '#333', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', padding: '2px 5px' }}><Plus size={12} /></button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                          <span style={{ color: '#00e5ff', fontWeight: 'bold' }}>Bs. {Number(item.precio) * Number(item.cantidad)}</span>
                          <Trash2 style={{ cursor: 'pointer', color: '#e60000' }} size={16} onClick={() => eliminarDelCarrito(item.id)} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {carrito.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '18px', fontWeight: 'bold', borderTop: '1px solid #333', paddingTop: '15px' }}>
                      <span>Total:</span>
                      <span style={{ color: '#00e5ff' }}>Bs. {precioTotalCarrito}</span>
                    </div>
                    <button onClick={descargarPDF} style={{ width: '100%', backgroundColor: '#333', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <FileDown size={18} /> Descargar Proforma
                    </button>
                    <button onClick={enviarWhatsApp} style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                      <MessageCircle size={18} /> Comprar por WhatsApp
                    </button>
                  </div>
                )}
              </div>
            )}
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
              {categorias.map((cat, index) => {
                // Usamos el signo + con comillas simples normales para evitar errores de sintaxis
                const rutaSegura = '/categoria/' + encodeURIComponent(cat);
                
                return (
                  <div 
                    key={index} 
                    style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', paddingBottom: '10px', 
                      borderBottom: '1px solid #222', 
                      color: window.location.pathname === rutaSegura ? '#00e5ff' : '#ccc' 
                    }} 
                    onClick={() => { 
                      setMostrarMenu(false); 
                      setBusqueda(''); 
                      navigate(rutaSegura); 
                      window.scrollTo(0,0);
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: window.location.pathname === rutaSegura ? 'bold' : 'normal' }}>{cat}</span>
                    {window.location.pathname === rutaSegura && <ChevronRight size={16} style={{ color: '#00e5ff' }} />}
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
        {/* NUEVA RUTA DINÁMICAA */}
        <Route path="/categoria/:id" element={<Categoria productos={productos} agregarAlCarrito={agregarAlCarrito} />} />
      <Route path="/producto/:id" element={<ProductoDetalle productos={productos} agregarAlCarrito={agregarAlCarrito} />} />
      <Route path="/login" element={session ? <Navigate to="/admin" /> : <Login />} />
     <Route path="/admin" element={session ? <Admin productos={productos} recargarProductos={cargarProductos} /> : <Navigate to="/login" />} />
      </Routes>
      
      {mensajeToast && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#00e5ff',
          color: '#000',
          padding: '15px 25px',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '15px',
          boxShadow: '0 10px 30px rgba(0, 229, 255, 0.3)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {mensajeToast}
        </div>
      )}

    </div>
  );
}

export default function App() { return <BrowserRouter><MainApp /></BrowserRouter>; }