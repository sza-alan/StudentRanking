import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiFetch } from '../services/api';

function Ranking() {
  const [students, setStudents] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggerAtualizacao, setTriggerAtualizacao] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
  const [cycleModal, setCycleModal] = useState({ show: false, name: '' });

  const navigate = useNavigate();
  const location = useLocation();
  const classroomId = location.state?.classroomId;
  const classroomName = location.state?.classroomName;

  const showFeedback = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: 'success' }), 4000);
  };

  useEffect(() => {
    if (!classroomId) {
      navigate('/dashboard');
      return;
    }

    const carregarDados = async () => {
      try {
        const [resRanking, resRewards] = await Promise.all([
          apiFetch(`/api/students/${classroomId}/ranking`),
          apiFetch(`/api/rewards/classroom/${classroomId}`)
        ]);

        if (resRanking.status === 401) {
          localStorage.clear();
          navigate('/login');
          return;
        }

        const dataRanking = await resRanking.json();
        setStudents(dataRanking);

        if (resRewards.ok) {
          const dataRewards = await resRewards.json();
          setRewards(dataRewards);
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setLoading(false);
      }
    };

    carregarDados();
  }, [triggerAtualizacao, navigate, classroomId]);

  const adicionarEstrela = async (id) => {
    try {
      await apiFetch(`/api/students/${id}/star`, { method: 'POST' });
      setTriggerAtualizacao(num => num + 1);
    } catch (error) {
      console.error("Erro ao adicionar estrela:", error);
      showFeedback("Erro ao adicionar estrela.", "error");
    }
  };

  const removerEstrela = async (id) => {
    try {
      await apiFetch(`/api/students/${id}/remove-star`, { method: 'POST' });
      setTriggerAtualizacao(num => num + 1);
    } catch (error) {
      console.error("Erro ao remover estrela:", error);
      showFeedback("Erro ao remover estrela.", "error");
    }
  };

  const confirmDeleteStudent = async () => {
    try {
      const response = await apiFetch(`/api/students/${deleteModal.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTriggerAtualizacao(num => num + 1);
        showFeedback(`Aluno(a) ${deleteModal.name} removido(a) com sucesso.`);
      } else {
        showFeedback("Erro ao remover o aluno.", "error");
      }
    } catch (error) {
      console.error("Erro ao deletar aluno:", error);
      showFeedback("Erro de conexão.", "error");
    } finally {
      setDeleteModal({ show: false, id: null, name: '' });
    }
  };

  const handleRedeem = async (rewardId) => {
    try {
      const response = await apiFetch(`/api/students/${selectedStudent.id}/redeem/${rewardId}`, {
        method: 'POST'
      });

      if (response.ok) {
        showFeedback("Troca realizada com sucesso! As estrelas foram debitadas.");
        setShowModal(false);
        setTriggerAtualizacao(num => num + 1);
      } else {
        const errorData = await response.json();
        showFeedback(errorData.message || "Erro ao realizar troca.", "error");
      }
    } catch (error) {
      console.error("Erro na compra:", error);
      showFeedback("Erro de conexão na compra.", "error");
    }
  };

  const importarExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await apiFetch(`/api/students/${classroomId}/import`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        showFeedback("Lista importada com sucesso!");
        setTriggerAtualizacao(num => num + 1);
      } else {
        showFeedback("Erro na importação do arquivo.", "error");
      }
    } catch (error) {
      console.error("Erro ao importar Excel:", error);
      showFeedback("Erro de conexão ao importar.", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmCloseCycle = async () => {
    if (!cycleModal.name.trim()) {
      showFeedback("Por favor, digite o nome do ciclo.", "error");
      return;
    }

    try {
      const response = await apiFetch(`/api/classrooms/${classroomId}/close-cycle`, {
        method: 'POST',
        body: JSON.stringify({ cycleName: cycleModal.name })
      });

      if (response.ok) {
        showFeedback(`✅ Ciclo "${cycleModal.name}" encerrado! Histórico salvo e ranking zerado.`);
        setTriggerAtualizacao(num => num + 1); 
        setCycleModal({ show: false, name: '' });
      } else {
        const errorData = await response.json();
        showFeedback(`Erro: ${errorData.message}`, "error");
      }
    } catch (error) {
      console.error("Erro ao encerrar ciclo:", error);
      showFeedback("Erro de conexão ao encerrar ciclo.", "error");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-blue-50 flex items-center justify-center text-2xl text-blue-600 font-bold">Carregando o ranking... ⏳</div>;
  }

  const totalAlunos = students.length;
  const totalEstrelas = students.reduce((soma, aluno) => soma + (Number(aluno.stars) || 0), 0);

  return (
    <div className="min-h-screen bg-sky-100 p-8 font-sans relative">
      
      {/* TOAST DE FEEDBACK FLUTUANTE SEM PULO */}
      {feedback.show && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-4 rounded-2xl shadow-xl text-white font-bold transition-all duration-300 flex items-center gap-3
          ${feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          <span>{feedback.type === 'success' ? '✅' : '❌'}</span>
          {feedback.message}
        </div>
      )}

      {/* MODAL: ENCERRAR CICLO */}
      {cycleModal.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🏁</span>
              <h2 className="text-2xl font-black text-slate-800">Encerrar Ciclo</h2>
            </div>
            <p className="text-slate-600 mb-6 font-medium">
              Isso irá guardar o saldo atual de todos os alunos no histórico e <strong className="text-red-500">zerar as estrelas</strong> para o início de uma nova etapa.
            </p>
            
            <label className="block text-sm font-bold text-slate-700 mb-2">Nome do Ciclo</label>
            <input 
              type="text" 
              autoFocus
              value={cycleModal.name}
              onChange={(e) => setCycleModal({ ...cycleModal, name: e.target.value })}
              placeholder="Ex: 1º Bimestre, Mês de Maio" 
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all mb-8"
            />

            <div className="flex gap-3">
              <button 
                onClick={() => setCycleModal({ show: false, name: '' })}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-2xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmCloseCycle}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl transition-all shadow-md"
              >
                Confirmar e Zerar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EXCLUIR ALUNO */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Remover Aluno?</h2>
            <p className="text-slate-500 mb-8">
              Tem certeza que deseja remover <strong>{deleteModal.name}</strong> da turma? Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModal({ show: false, id: null, name: '' })}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-2xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteStudent}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl transition-all shadow-md"
              >
                Sim, remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE COMPRAS DA LOJINHA */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-black text-slate-800 mb-2">🛍️ Lojinha do(a) {selectedStudent?.fullName}</h2>
            <p className="text-slate-500 mb-6 font-medium">
              Saldo: <span className="text-yellow-500 text-xl font-bold">{selectedStudent?.stars}⭐</span>
            </p>
            
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-2">
              {rewards.length === 0 ? (
                <p className="text-center text-gray-400 py-4">A lojinha está vazia.</p>
              ) : (
                rewards.map(reward => {
                  const podeComprar = selectedStudent?.stars >= reward.starCost;
                  return (
                    <button
                      key={reward.id}
                      onClick={() => handleRedeem(reward.id)}
                      disabled={!podeComprar}
                      className={`flex justify-between items-center p-4 rounded-2xl border-2 transition-all 
                        ${podeComprar 
                          ? 'border-indigo-100 hover:border-indigo-500 bg-indigo-50 shadow-sm hover:shadow-md' 
                          : 'border-gray-100 opacity-60 cursor-not-allowed bg-gray-50'}`}
                    >
                      <span className="font-bold text-slate-700 text-left leading-tight">{reward.name}</span>
                      <span className={`${podeComprar ? 'bg-yellow-400' : 'bg-gray-300'} text-white px-3 py-1 rounded-lg font-black ml-4 whitespace-nowrap`}>
                        {reward.starCost} ⭐
                      </span>
                    </button>
                  );
                })
              )}
            </div>
            
            <button 
              onClick={() => setShowModal(false)}
              className="w-full mt-6 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-3 rounded-2xl transition-colors"
            >
              Fechar Lojinha
            </button>
          </div>
        </div>
      )}

      {/* LAYOUT PRINCIPAL DO RANKING */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-yellow-400">
        
        <div className="bg-yellow-400 p-6 flex items-center justify-center text-white relative min-h-[100px]">
          <button 
            onClick={() => navigate('/dashboard')}
            className="absolute left-4 md:left-6 z-10 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-xl transition-colors text-sm shadow-sm"
          >
            ← Voltar
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-md px-16 md:px-24 text-center">
            🏆 Ranking: {classroomName} 🏆
          </h1>
        </div>

        <div className="bg-blue-50 p-4 border-b-2 border-blue-100 flex justify-between items-center px-8 flex-wrap gap-4">
          <div className="flex gap-6">
            <div className="text-blue-800 font-bold">
              <span className="text-2xl">{totalAlunos}</span> Alunos
            </div>
            <div className="text-yellow-600 font-bold">
              <span className="text-2xl">{totalEstrelas}</span> Estrelas Dadas
            </div>
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto justify-end">
            <button 
              onClick={() => navigate('/rewards', { state: { classroomId, classroomName } })}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold cursor-pointer shadow-md transition-colors flex items-center gap-2"
            >
              🛍️ Lojinha
            </button>

            <button 
              onClick={() => navigate('/reports', { state: { classroomId, classroomName } })}
              className="bg-slate-800 hover:bg-black text-white px-4 py-2 rounded-xl font-bold cursor-pointer shadow-md transition-colors flex items-center gap-2"
            >
              📊 Relatórios
            </button>

            <button 
              onClick={() => setCycleModal({ show: true, name: '' })}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold cursor-pointer shadow-md transition-colors flex items-center gap-2"
            >
              🏁 Encerrar
            </button>

            <label className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold cursor-pointer shadow-md transition-colors flex items-center gap-2">
              📁 Importar
              <input type="file" accept=".xlsx" className="hidden" onChange={importarExcel} />
            </label>
          </div>
        </div>

        <div className="p-6">
          {students.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">Nenhum aluno cadastrado ainda. Importe a lista!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {students.map((aluno, index) => (
                <div 
                  key={aluno.id} 
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all transform hover:scale-[1.02]
                    ${index === 0 ? 'bg-yellow-50 border-yellow-400 shadow-yellow-200 shadow-lg' : 
                      index === 1 ? 'bg-gray-50 border-gray-400 shadow-md' : 
                      index === 2 ? 'bg-orange-50 border-orange-400 shadow-md' : 
                      'bg-white border-gray-100 hover:border-blue-300'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl w-10 text-center">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : <span className="text-gray-400 text-xl">{index + 1}º</span>}
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{aluno.fullName}</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 text-2xl font-black text-yellow-500">
                      <span>{aluno.stars}</span>
                      <span>⭐</span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setSelectedStudent(aluno); setShowModal(true); }}
                        className="bg-indigo-50 hover:bg-indigo-500 text-indigo-400 hover:text-white w-12 h-12 rounded-full text-xl flex items-center justify-center transition-all mr-2 border border-indigo-100 shadow-sm"
                        title="Comprar na Lojinha"
                      >
                        🛍️
                      </button>

                      <button 
                        onClick={() => setDeleteModal({ show: true, id: aluno.id, name: aluno.fullName })}
                        className="bg-gray-100 hover:bg-red-500 text-gray-400 hover:text-white w-12 h-12 rounded-full text-xl flex items-center justify-center transition-all mr-2"
                        title="Remover Aluno"
                      >
                        🗑️
                      </button>

                      <button 
                        onClick={() => removerEstrela(aluno.id)}
                        className="bg-red-100 hover:bg-red-500 text-red-600 hover:text-white active:bg-red-600 w-12 h-12 rounded-full text-2xl font-bold flex items-center justify-center shadow-sm transition-colors"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => adicionarEstrela(aluno.id)}
                        className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white w-12 h-12 rounded-full text-2xl font-bold flex items-center justify-center shadow-md transition-colors"
                      >
                        +
                      </button>
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Ranking;