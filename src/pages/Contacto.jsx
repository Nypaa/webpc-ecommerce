import { MapPin, MessageCircle, ThumbsUp } from 'lucide-react';

export default function Contacto() {
  const sucursales = [
    {
      nombre: "TECNOCENTER - PUNTO TECNOLOGICO",
      direccion: "Calle Esteban Arce N° 1449 Galeria TECNOCENTER OF. 5",
      vendedores: ["VENDEDOR 1", "VENDEDOR 2"]
    },
    {
      nombre: "SUPERMALL - PUNTO TECNOLOGICO",
      direccion: "Av. Blanco Galindo Esq. Av Peru Edificio SUPERMALL Piso 4 Of. # 1",
      vendedores: ["VENDEDOR 1", "VENDEDOR 2"]
    },
    {
      nombre: "INDANA - PUNTO TECNOLOGICO",
      direccion: "COMERCIAL INDANA",
      vendedores: ["VENDOR 1", "VENDEDOR 2"]
    }
  ];

  return (
    <main style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', boxSizing: 'border-box' }}>
      
      <h2 style={{ color: '#fff', fontSize: '24px', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '40px' }}>
        Sucursales
      </h2>

      {/* BLOQUE DE SUCURSALES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
        {sucursales.map((sucursal, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
            
            {/* Espacio para la foto de la tienda */}
            <div style={{ width: '280px', height: '200px', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ color: '#555', fontSize: '14px' }}>Foto Sucursal {idx + 1}</span>
            </div>
            
            {/* Información y botones */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '18px' }}>{sucursal.nombre}</h3>
              
              <button style={{ backgroundColor: '#1877F2', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', width: 'fit-content' }}>
                <MapPin size={18} /> {sucursal.direccion}
              </button>
              
              {sucursal.vendedores.map((vendedor, vIdx) => (
                <button key={vIdx} style={{ backgroundColor: '#25D366', color: '#000', border: 'none', padding: '12px 20px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', width: 'fit-content' }}>
                  <MessageCircle size={18} /> {vendedor}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* BLOQUE SOCIAL Y SEO */}
      <div style={{ marginTop: '80px', borderTop: '1px solid #333', paddingTop: '40px' }}>
        <h3 style={{ color: '#fff', margin: '0 0 15px 0' }}>Síguenos</h3>
        <p style={{ color: '#aaa', margin: '0 0 20px 0', fontSize: '14px' }}>Mantente al día con nuestras ofertas, novedades y lanzamientos en redes sociales.</p>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '50px' }}>
          <button style={{ backgroundColor: '#1877F2', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
            <ThumbsUp size={18} /> webPC Bolivia
          </button>
          <button style={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff', padding: '10px 20px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
            TikTok @webpc
          </button>
        </div>

        <div style={{ backgroundColor: '#141414', padding: '20px', borderRadius: '8px', border: '1px solid #222' }}>
          <p style={{ color: '#888', margin: 0, fontSize: '13px', lineHeight: '1.6' }}>
            En webPC encontrarás una amplia selección de hardware y periféricos al mejor precio en Bolivia: procesadores, tarjetas gráficas, laptops, monitores, teclados, mouse, memorias RAM, almacenamiento SSD y accesorios gaming. Todos nuestros productos cuentan con garantía y soporte técnico. Visítanos en nuestras sucursales en Cochabamba y Santa Cruz o cotiza en línea.
          </p>
        </div>
      </div>
    </main>
  );
}