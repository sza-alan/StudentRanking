import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

function Rewards() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { classroomId, classroomName } = location.state || {};

  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [starCost, setStarCost] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });

  const showFeedback = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: 'success' }), 4000);
  };

  useEffect(() => {
    if (!classroomId) {
      navigate('/dashboard');
      return;
    }

    const fetchRewards = async () => {
      try {
        const response = await apiFetch(`/api/rewards/classroom/${classroomId}`);
        
        if (response.ok) {
          const data = await response.json();
          setRewards(data);
        }
      } catch (error) {
        console.error("Erro ao buscar prémios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [classroomId, navigate, trigger]);

  const handleCreateReward = async (e) => {
    e.preventDefault();
    if (!name || !starCost) return;

    try {
      setIsCreating(true);
      const response = await apiFetch('/api/rewards', {
        method: 'POST',
        body: JSON.stringify({
          name: name,
          starCost: parseInt(starCost),
          classroomId: classroomId
        })
      });

      if (response.ok) {
        setName('');
        setStarCost('');
        setTrigger(prev => prev + 1);
        showFeedback("Recompensa adicionada à lojinha!");
      } else {
        showFeedback("Erro ao criar prémio.", "error");
      }
    } catch (error) {
      console.error("Erro:", error);
      showFeedback("Erro de conexão.", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const confirmDeleteReward = async () => {
    try {
      const response = await apiFetch(`/api/rewards/${deleteModal.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTrigger(prev => prev + 1);
        showFeedback("Prêmio excluído com sucesso.");
      } else {
        showFeedback("Erro ao excluir o prêmio.", "error");
      }
    } catch (error) {
      console.error("Erro ao deletar prêmio:", error);
      showFeedback("Erro de conexão.", "error");
    } finally {
      setDeleteModal({ show: false, id: null, name: '' });
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-6 md:p-12 font-sans relative">
      
      {/* TOAST DE FEEDBACK */}
      {feedback.show && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-4 rounded-2xl shadow-xl text-white font-bold transition-all flex items-center gap-3
          ${feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          <span>{feedback.type === 'success' ? '✅' : '❌'}</span>
          {feedback.message}
        </div>
      )}

      {/* MODAL: EXCLUIR PRÊMIO */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Remover Prêmio?</h2>
            <p className="text-slate-500 mb-8">
              Deseja retirar <strong>{deleteModal.name}</strong> da lojinha?
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModal({ show: false, id: null, name: '' })}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-2xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteReward}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl transition-all shadow-md"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/ranking', { state: { classroomId, classroomName } })}
          className="mb-6 text-indigo-600 font-bold flex items-center gap-2 hover:underline"
        >
          ← Voltar para o Ranking
        </button>

        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-800">🛍️ Lojinha: {classroomName}</h1>
          <p className="text-slate-500 font-medium mt-2">Cria recompensas para os alunos trocarem pelas suas estrelas!</p>
        </header>

        <form onSubmit={handleCreateReward} className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-100 flex flex-col md:flex-row gap-4 items-end mb-10">
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-slate-700 mb-2">Nome do Prémio</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: 5 minutos a mais no recreio" 
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              required
            />
          </div>
          <div className="w-full md:w-32">
            <label className="block text-sm font-bold text-slate-700 mb-2">Custo (⭐)</label>
            <input 
              type="number" 
              min="1"
              value={starCost}
              onChange={(e) => setStarCost(e.target.value)}
              placeholder="Ex: 10" 
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isCreating}
            className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-md transition-all ${isCreating ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1'}`}
          >
            {isCreating ? 'A criar...' : '+ Adicionar'}
          </button>
        </form>

        {loading ? (
          <div className="text-center py-10 text-xl font-bold text-indigo-500">A carregar a montra... ⏳</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.length === 0 ? (
              <div className="col-span-full bg-white p-8 rounded-3xl border border-dashed border-gray-300 text-center text-gray-500">
                A lojinha ainda está vazia. Adiciona o primeiro prémio acima!
              </div>
            ) : (
              rewards.map((reward) => (
                <div key={reward.id} className="relative bg-white p-6 rounded-3xl border-2 border-transparent shadow-sm hover:border-yellow-400 transition-colors group flex flex-col justify-between">
                  
                  {/* BOTÃO ATUALIZADO: Abre o modal */}
                  <button 
                    onClick={() => setDeleteModal({ show: true, id: reward.id, name: reward.name })}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                    title="Excluir Prêmio"
                  >
                    🗑️
                  </button>

                  <div>
                    <div className="text-4xl mb-4">🎁</div>
                    <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2 pr-6">{reward.name}</h3>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg font-black w-fit border border-yellow-200">
                    {reward.starCost} ⭐
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Rewards;