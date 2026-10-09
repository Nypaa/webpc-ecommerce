import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Lock, Mail, LogIn, ArrowLeft } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const manejarLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
      setCargando(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <main style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#141414', padding: '40px', borderRadius: '12px', border: '1px solid #222', width: '100%', maxWidth: '400px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: '#00f885', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: 0 }}>
          <ArrowLeft size={18} /> Volver a la tienda
        </button>
        <h2 style={{ color: '#fff', marginTop: 0, marginBottom: '30px', fontSize: '24px' }}>Acceso Administrativo</h2>
        
        {error && (
          <div style={{ backgroundColor: 'rgba(230, 0, 0, 0.1)', border: '1px solid #e60000', color: '#ff4444', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={manejarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input type="email" placeholder="Correo electrónico" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', backgroundColor: '#1f1f1f', border: '1px solid #333', color: '#fff', padding: '12px 12px 12px 40px', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input type="password" placeholder="Contraseña" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', backgroundColor: '#1f1f1f', border: '1px solid #333', color: '#fff', padding: '12px 12px 12px 40px', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={cargando} style={{ backgroundColor: '#00f885', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: cargando ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            {cargando ? 'Verificando...' : <><LogIn size={20} /> Ingresar al Panel</>}
          </button>
        </form>
      </div>
    </main>
  );
}