import { MapPin, MessageCircle, ThumbsUp } from 'lucide-react';

export default function Contacto() {
  // Dejamos solo la sucursal principal con los datos reales
  const sucursales = [
    {
      nombre: "Kiru Tech - Tienda Principal",
      direccion: "Avenida Medardo Chávez 439, Riberalta",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Avenida+Medardo+Chávez+439,+Riberalta",
      vendedores: [
        { nombre: "Ventas y Cotizaciones", numero: "59173048045" }
      ]
    }
  ];

  return (
    <main style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', boxSizing: 'border-box' }}>
      
      <h2 style={{ color: '#fff', fontSize: '24px', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '40px' }}>
        Nuestra Ubicación
      </h2>

      {/* BLOQUE DE SUCURSAL (Ahora optimizado para una sola) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
        {sucursales.map((sucursal, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            
            {/* CONTENEDOR DEL LOGO (SUPABASE) */}
            <div style={{ width: '280px', height: '200px', backgroundColor: '#141414', borderRadius: '8px', border: '1px solid #333', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, overflow: 'hidden', padding: '20px', boxSizing: 'border-box' }}>
              <img 
                src="https://dugjqlvigojxpzmhiasn.supabase.co/storage/v1/object/public/productos/kirutechv2.jpeg" 
                alt="Logo Kiru Tech" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>
            
            {/* Información y enlaces funcionales */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '300px' }}>
              <h3 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '20px' }}>{sucursal.nombre}</h3>
              
              {/* ENLACE UNIVERSAL A GOOGLE MAPS */}
              <a 
                href={sucursal.mapUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ backgroundColor: '#141414', color: '#fff', border: '1px solid #333', padding: '12px 20px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', width: 'fit-content', textDecoration: 'none', transition: 'border-color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#00ff44'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#333'}
              >
                <MapPin size={18} color="#00ff44" /> {sucursal.direccion}
              </a>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                {sucursal.vendedores.map((vendedor, vIdx) => (
                  <a 
                    key={vIdx} 
                    href={`https://wa.me/${vendedor.numero}?text=Hola,%20quisiera%20hacer%20una%20consulta%20sobre%20un%20producto.`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ backgroundColor: '#25D366', color: '#000', border: 'none', padding: '12px 20px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none' }}
                  >
                    <MessageCircle size={18} /> {vendedor.nombre}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BLOQUE SOCIAL Y SEO */}
      <div style={{ marginTop: '80px', borderTop: '1px solid #333', paddingTop: '40px' }}>
        <h3 style={{ color: '#fff', margin: '0 0 15px 0' }}>Síguenos</h3>
        <p style={{ color: '#aaa', margin: '0 0 20px 0', fontSize: '14px' }}>Mantente al día con nuestras ofertas, novedades y lanzamientos en redes sociales.</p>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '50px', flexWrap: 'wrap' }}>
          <button style={{ backgroundColor: '#1877F2', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
            <ThumbsUp size={18} /> Facebook Kiru Tech
          </button>
          <button style={{ backgroundColor: '#141414', border: '1px solid #333', color: '#fff', padding: '10px 20px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
            TikTok @kirutech
          </button>
        </div>

        <div style={{ backgroundColor: '#141414', padding: '20px', borderRadius: '8px', border: '1px solid #222' }}>
          <p style={{ color: '#888', margin: 0, fontSize: '13px', lineHeight: '1.6' }}>
            En Kiru Tech encontrarás una amplia selección de hardware y periféricos al mejor precio del mercado: procesadores, tarjetas gráficas, laptops, monitores, teclados, mouse, memorias RAM, almacenamiento SSD y accesorios gaming. Todos nuestros productos cuentan con garantía oficial y soporte técnico especializado. Somos importadores directos de Perú y Brasil. Cotiza en línea y arma el setup de tus sueños con nosotros.
          </p>
        </div>
      </div>
    </main>
  );
}