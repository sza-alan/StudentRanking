import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importingMaster, setImportingMaster] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });

  const showFeedback = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: 'success' }), 4000);
  };

  useEffect(() => {
    const carregarTurmas = async () => {
      try {
        const response = await apiFetch('/api/classrooms/my');

        if (response.status === 401) {
          localStorage.clear();
          navigate('/login');
          return;
        }

        const data = await response.json();
        setTurmas(data);
      } catch (error) {
        console.error("Erro ao buscar turmas:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarTurmas();
  }, [navigate, token, trigger]);

  const handleMasterImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setImportingMaster(true);
      const response = await apiFetch('/api/students/master-import', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        showFeedback("Setup concluído! Turmas e alunos organizados.");
        setTrigger(prev => prev + 1);
      } else {
        showFeedback("Erro na importação da planilha.", "error");
      }
    } catch (error) {
      console.error("Erro no upload mestre:", error);
      showFeedback("Erro de conexão com o servidor.", "error");
    } finally {
      setImportingMaster(false);
      event.target.value = null; 
    }
  };

  const confirmDeleteClassroom = async () => {
    try {
      const response = await apiFetch(`/api/classrooms/${deleteModal.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTurmas(turmas.filter(t => t.id !== deleteModal.id));
        showFeedback("Turma apagada com sucesso.");
      } else {
        showFeedback("Erro ao deletar turma.", "error");
      }
    } catch (error) {
      console.error("Erro ao deletar turma:", error);
      showFeedback("Erro de conexão.", "error");
    } finally {
      setDeleteModal({ show: false, id: null, name: '' });
    }
  };

  const abrirTurma = (id, nome) => {
    navigate('/ranking', { state: { classroomId: id, classroomName: nome } });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans relative">
      
      {/* TOAST DE FEEDBACK */}
      {feedback.show && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-4 rounded-2xl shadow-xl text-white font-bold transition-all flex items-center gap-3
          ${feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          <span>{feedback.type === 'success' ? '✅' : '❌'}</span>
          {feedback.message}
        </div>
      )}

      {/* MODAL: EXCLUIR TURMA */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Apagar Turma?</h2>
            <p className="text-slate-500 mb-8">
              Deletar <strong>{deleteModal.name}</strong> apagará todos os alunos e estrelas vinculados a ela de forma irreversível. Confirma?
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModal({ show: false, id: null, name: '' })}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-2xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteClassroom}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl transition-all shadow-md"
              >
                Apagar Turma
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800">Olá, Prof. {user.name}! 👋</h1>
            <p className="text-slate-500">Selecione uma turma para gerenciar o ranking.</p>
          </div>
  
          <div className="flex gap-4">
            {user.role === 'Admin' && (
              <button 
                onClick={() => navigate('/admin/teachers')}
                className="bg-slate-800 text-white font-bold hover:bg-slate-900 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                ⚙️ Painel Admin
              </button>
            )}

            <button 
              onClick={() => { localStorage.clear(); navigate('/login'); }}
              className="text-red-500 font-bold hover:underline bg-red-50 px-4 py-2 rounded-lg"
            >
              Sair do Sistema
            </button>
          </div>
        </header>

        <div className="mb-10 flex flex-col md:flex-row items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-blue-100">
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 text-lg">🚀 Importação de Alunos</h3>
            <p className="text-sm text-slate-500">Suba a planilha com [Nome | Sobrenome | Sala] para configurar tudo de uma vez.</p>
          </div>
          <label className={`
            ${importingMaster ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 cursor-pointer'} 
            text-white px-8 py-3 rounded-2xl font-black shadow-lg transition-all flex items-center gap-2`}
          >
            {importingMaster ? '⚙️ Processando...' : 'Fazer Upload'}
            <input type="file" accept=".xlsx" className="hidden" onChange={handleMasterImport} disabled={importingMaster} />
          </label>
        </div>

        {loading ? (
          <div className="text-center text-blue-500 font-bold text-xl">Carregando... ⏳</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {turmas.map((turma) => (
              <div 
                key={turma.id}
                onClick={() => abrirTurma(turma.id, turma.name)}
                className="relative bg-white p-8 rounded-3xl border-2 border-transparent shadow-sm hover:shadow-xl hover:border-yellow-400 hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center text-center group"
              >
                {/* BOTÃO ATUALIZADO: Abre o modal e impede que a turma abra (stopPropagation) */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteModal({ show: true, id: turma.id, name: turma.name });
                  }}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-2"
                  title="Excluir Turma"
                >
                  🗑️
                </button>

                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏫</div>
                <h3 className="text-2xl font-black text-slate-800">{turma.name}</h3>
                <p className="text-slate-500 text-sm mt-2 font-medium">Acessar Ranking →</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;