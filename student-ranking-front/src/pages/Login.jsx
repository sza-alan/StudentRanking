import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const fazerLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('E-mail ou senha incorretos');
      }

      const data = await response.json();
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');

    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-t-8 border-yellow-400">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2">
          Bem-vindo(a) 👋
        </h1>
        <p className="text-center text-gray-500 mb-8">Faça login para acessar suas turmas.</p>

        <form onSubmit={fazerLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-colors"
              placeholder="professora@escola.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {erro && <p className="text-red-500 text-sm font-bold text-center">{erro}</p>}

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors mt-4"
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;