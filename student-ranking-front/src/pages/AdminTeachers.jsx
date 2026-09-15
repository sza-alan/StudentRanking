import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

function AdminTeachers() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [trigger, setTrigger] = useState(0);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.role !== 'Admin') return;

    const fetchTeachers = async () => {
      try {
        const response = await apiFetch('/api/auth/teachers');
        if (response.ok) {
          const data = await response.json();
          setTeachers(data);
        }
      } catch (error) {
        console.error("Erro ao buscar professores:", error);
      }
    };
    fetchTeachers();
  }, [trigger, user.role]);

  if (user.role !== 'Admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 text-center">
        <h1 className="text-6xl mb-4">⛔</h1>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Acesso Restrito</h2>
        <button onClick={() => navigate('/dashboard')} className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">
          Voltar para Home
        </button>
      </div>
    );
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiFetch('/api/auth/register-teacher', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();

      if (response.ok) {
        setName(''); setEmail(''); setPassword('');
        setTrigger(prev => prev + 1);
      } else {
        alert(`❌ Erro: ${data.message || 'Falha ao cadastrar.'}`);
      }
    } catch (error) {
      console.error("Erro na requisição de cadastro:", error);
      alert("❌ Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, teacherName) => {
    if (window.confirm(`⚠️ DESTRUIÇÃO TOTAL: Apagar "${teacherName}" deletará todas as turmas, alunos e estrelas dele. Confirma?`)) {
      try {
        const response = await apiFetch(`/api/auth/teacher/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setTrigger(prev => prev + 1);
        }
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1">
          <button onClick={() => navigate('/dashboard')} className="mb-6 text-indigo-600 font-bold flex items-center gap-2 hover:underline">
            ← Voltar para Dashboard
          </button>
          <header className="mb-8">
            <h1 className="text-4xl font-black text-slate-800">⚙️ Painel Admin</h1>
            <p className="text-slate-500 font-medium mt-2">Gerencie o acesso dos professores.</p>
          </header>

          <form onSubmit={handleRegister} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-5">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Novo Professor</h2>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nome</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-900 mt-2">
              {loading ? 'Cadastrando...' : '+ Cadastrar'}
            </button>
          </form>
        </div>

        <div className="flex-1 lg:mt-24">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Professores Cadastrados ({teachers.length})</h2>
          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
            {teachers.length === 0 ? (
              <p className="text-slate-400">Nenhum professor cadastrado ainda.</p>
            ) : (
              teachers.map(teacher => (
                <div key={teacher.id} className="bg-white p-5 rounded-2xl border-2 border-transparent shadow-sm hover:border-red-100 flex justify-between items-center group transition-all">
                  <div>
                    <h3 className="font-bold text-slate-800">{teacher.name}</h3>
                    <p className="text-sm text-slate-500">{teacher.email}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(teacher.id, teacher.name)}
                    className="bg-red-50 text-red-400 hover:bg-red-500 hover:text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all opacity-50 group-hover:opacity-100"
                    title="Excluir Professor"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminTeachers;