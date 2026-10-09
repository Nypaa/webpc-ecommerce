import { MapPin, MessageCircle, ThumbsUp } from 'lucide-react';

export default function Contacto() {
  // Datos de la sucursal (Mantenemos tu lógica original segura)
  const sucursal = {
    nombre: "Kiru Tech - Tienda Principal",
    direccion: "Avenida Medardo Chávez 439, Riberalta",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Avenida+Medardo+Chávez+439,+Riberalta",
    vendedor: { nombre: "Ventas y Cotizaciones", numero: "59173048045" }
  };

  return (
    <main style={{ padding: 'clamp(20px, 5vw, 60px) 20px', maxWidth: '1400px', margin: '0 auto', color: '#fff', boxSizing: 'border-box' }}>
      
      <h1 style={{ textAlign: 'center', fontSize: 'clamp(28px, 5vw, 36px)', marginBottom: '40px', color: '#fff', letterSpacing: '1px' }}>
        Conecta con <span style={{ color: '#00f885' }}>KiruTech</span>
      </h1>

      {/* ============================================== */}
      {/* EL TRÍPTICO (Imagen - Datos - Imagen)          */}
      {/* ============================================== */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'stretch', gap: 'clamp(20px, 3vw, 40px)' }}>
        
        {/* 1. IMAGEN IZQUIERDA */}
        <div style={{ flex: '1 1 300px', maxWidth: '400px', display: 'flex' }}>
          <img 
            /* Imagen 1 (Original) */
            src="https://dugjqlvigojxpzmhiasn.supabase.co/storage/v1/object/public/productos/KiruImgContc.png" 
            alt="Hardware Kiru Tech" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', border: '1px solid #363b40', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
          />
        </div>

        {/* 2. CENTRO: CONTACTO Y REDES */}
        <div style={{ 
          flex: '1 1 350px', maxWidth: '500px', 
          background: 'linear-gradient(rgba(10, 12, 13, 0.95), rgba(10, 12, 13, 0.95)), url("https://www.transparenttextures.com/patterns/brushed-alum-dark.png") #0a0c0d', 
          padding: '40px 30px', borderRadius: '12px', border: '1px solid #363b40', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '30px'
        }}>
          
          <div>
            <h3 align="center" style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '20px', borderBottom: '1px solid #363b40', paddingBottom: '10px' }}>
              {sucursal.nombre}
            </h3>
            
            <a 
              href={sucursal.mapUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa', fontSize: '15px', margin: '0 0 20px 0', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#00f885'}
              onMouseOut={(e) => e.currentTarget.style.color = '#aaa'}
            >
              <MapPin color="#00f885" size={20} style={{ flexShrink: 0 }} />
              {sucursal.direccion}
            </a>

            <a 
              href={`https://wa.me/${sucursal.vendedor.numero}?text=Hola,%20quisiera%20hacer%20una%20consulta%20sobre%20un%20producto.`}
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', backgroundColor: '#00f885', color: '#000', textDecoration: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <MessageCircle size={20} /> {sucursal.vendedor.nombre}
            </a>
          </div>

          <div>
            <h3 align="center" style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '20px', borderBottom: '1px solid #363b40', paddingBottom: '10px' }}>
              Síguenos
            </h3>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
              Mantente al día con nuestras ofertas, novedades y lanzamientos en redes sociales.
            </p>
            
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <button style={{ flex: '1 1 120px', backgroundColor: '#1877F2', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                <ThumbsUp size={18} /> Facebook
              </button>
              <button style={{ flex: '1 1 120px', backgroundColor: '#141414', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                TikTok
              </button>
            </div>
          </div>

        </div>

        {/* 3. IMAGEN DERECHA (Acá puedes poner tu nueva imagen) */}
        <div style={{ flex: '1 1 300px', maxWidth: '400px', display: 'flex' }}>
          <img 
            /* REEMPLAZA ESTE ENLACE POR TU SEGUNDA IMAGEN VERTICAL */
            src="https://dugjqlvigojxpzmhiasn.supabase.co/storage/v1/object/public/productos/KuruImgContc2.png" 
            alt="Setup Gamer Kiru Tech" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', border: '1px solid #363b40', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
          />
        </div>

      </div>

      {/* ============================================== */}
      {/* BLOQUE SEO ORIGINAL (Recuperado y estilizado)  */}
      {/* ============================================== */}
      <div style={{ marginTop: '60px', background: 'linear-gradient(rgba(10, 12, 13, 0.95), rgba(10, 12, 13, 0.95)), url("https://www.transparenttextures.com/patterns/brushed-alum-dark.png") #0a0c0d', padding: '25px', borderRadius: '12px', border: '1px solid #363b40', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <p style={{ color: '#888', margin: 0, fontSize: '14px', lineHeight: '1.6', textAlign: 'center' }}>
          En Kiru Tech encontrarás una amplia selección de hardware y periféricos al mejor precio del mercado: procesadores, tarjetas gráficas, laptops, monitores, teclados, mouse, memorias RAM, almacenamiento SSD y accesorios gaming. Todos nuestros productos cuentan con garantía oficial y soporte técnico especializado. Somos importadores directos de Perú y Brasil. Cotiza en línea y arma el setup de tus sueños con nosotros.
        </p>
      </div>

    </main>
  );
}