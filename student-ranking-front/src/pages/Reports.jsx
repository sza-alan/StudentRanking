import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

function Reports() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { classroomId, classroomName } = location.state || {};

  const [history, setHistory] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(0);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ show: false, cycleName: '' });

  const showFeedback = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: 'success' }), 4000);
  };

  useEffect(() => {
    if (!classroomId) {
      navigate('/dashboard');
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await apiFetch(`/api/classrooms/${classroomId}/history`);
        
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
          if (data.length > 0 && !selectedCycle) {
            setSelectedCycle(data[0]);
          } else if (data.length > 0 && selectedCycle) {
            setSelectedCycle(data.find(c => c.cycleName === selectedCycle.cycleName) || data[0]);
          } else {
            setSelectedCycle(null);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [classroomId, navigate, trigger, selectedCycle]);

  const confirmDeleteCycle = async () => {
    try {
      const encodedName = encodeURIComponent(deleteModal.cycleName);
      const response = await apiFetch(`/api/classrooms/${classroomId}/history/${encodedName}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTrigger(prev => prev + 1);
        showFeedback("Relatório excluído com sucesso.");
      } else {
        showFeedback("Erro ao excluir relatório.", "error");
      }
    } catch (error) {
      console.error("Erro ao deletar relatório:", error);
      showFeedback("Erro de conexão.", "error");
    } finally {
      setDeleteModal({ show: false, cycleName: '' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="min-h-screen bg-blue-50 flex items-center justify-center text-2xl text-blue-600 font-bold">Gerando Relatórios... ⏳</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans relative print:bg-white print:p-0">
      
      {/* TOAST DE FEEDBACK (Escondido na impressão) */}
      {feedback.show && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-4 rounded-2xl shadow-xl text-white font-bold transition-all duration-300 flex items-center gap-3 print:hidden
          ${feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          <span>{feedback.type === 'success' ? '✅' : '❌'}</span>
          {feedback.message}
        </div>
      )}

      {/* MODAL: EXCLUIR RELATÓRIO (Escondido na impressão) */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Apagar Relatório?</h2>
            <p className="text-slate-500 mb-8">
              Isso apagará permanentemente os dados do ciclo <strong>{deleteModal.cycleName}</strong>. Esta ação é irreversível.
            </p>
            
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({ show: false, cycleName: '' })} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-2xl transition-colors">
                Cancelar
              </button>
              <button onClick={confirmDeleteCycle} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl transition-all shadow-md">
                Sim, apagar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* CABEÇALHO ESCONDIDO NA IMPRESSÃO */}
        <div className="print:hidden">
          <button 
            onClick={() => navigate('/ranking', { state: { classroomId, classroomName } })}
            className="mb-6 text-indigo-600 font-bold flex items-center gap-2 hover:underline"
          >
            ← Voltar para o Ranking
          </button>
          
          <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-800">📊 Relatórios de Desempenho</h1>
              <p className="text-slate-500 font-medium mt-2">Histórico de fechamentos da turma: {classroomName}</p>
            </div>
            
            {history.length > 0 && (
              <button 
                onClick={handlePrint}
                className="bg-slate-800 hover:bg-black text-white px-6 py-3 rounded-xl font-bold shadow-md transition-colors flex items-center gap-2"
              >
                🖨️ Imprimir Relatório
              </button>
            )}
          </header>
        </div>

        {history.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center text-gray-500 print:hidden">
            <div className="text-5xl mb-4">📭</div>
            Nenhum ciclo foi encerrado ainda para esta turma. <br/>
            Quando encerrar um ciclo no Ranking, o relatório aparecerá aqui.
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* MENU LATERAL DE CICLOS (Escondido na Impressão) */}
            <div className="w-full md:w-64 flex flex-col gap-3 print:hidden">
              <h3 className="font-bold text-slate-400 uppercase tracking-wider text-sm mb-2">Ciclos Encerrados</h3>
              {history.map(cycle => (
                <button
                  key={cycle.cycleName}
                  onClick={() => setSelectedCycle(cycle)}
                  className={`text-left px-5 py-4 rounded-2xl font-bold transition-all border-2
                    ${selectedCycle?.cycleName === cycle.cycleName 
                      ? 'bg-white border-indigo-500 text-indigo-700 shadow-sm' 
                      : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-200'}`}
                >
                  {cycle.cycleName}
                </button>
              ))}
            </div>

            {/* ÁREA DO RELATÓRIO (Visível na impressão) */}
            {selectedCycle && (
              <div className="flex-1 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
                
                {/* CABEÇALHO DA IMPRESSÃO */}
                <div className="flex justify-between items-start mb-10 border-b-2 border-slate-100 pb-8 print:border-black">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 print:text-black">Turma: {classroomName}</h2>
                    <h3 className="text-xl font-bold text-indigo-600 mt-1 print:text-gray-800">Ciclo: {selectedCycle.cycleName}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-400 uppercase">Data de Fechamento</p>
                    <p className="text-lg font-bold text-slate-700">
                      {new Date(selectedCycle.closedAt).toLocaleDateString('pt-BR')}
                    </p>
                    {/* Botão de excluir escondido na impressão */}
                    <button 
                      onClick={() => setDeleteModal({ show: true, cycleName: selectedCycle.cycleName })}
                      className="mt-4 text-sm font-bold text-red-400 hover:text-red-600 hover:underline print:hidden flex items-center justify-end w-full gap-1"
                    >
                      🗑️ Excluir Relatório
                    </button>
                  </div>
                </div>

                {/* TABELA DE ALUNOS */}
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100 print:border-black text-slate-400 uppercase text-sm tracking-wider">
                      <th className="py-4 px-2 font-bold w-16">Pos</th>
                      <th className="py-4 px-2 font-bold">Nome do Aluno</th>
                      <th className="py-4 px-2 font-bold text-right">Estrelas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCycle.students.map((aluno, index) => (
                      <tr key={aluno.studentId} className="border-b border-slate-50 hover:bg-slate-50 print:border-gray-200">
                        <td className="py-4 px-2 font-bold text-slate-400">
                           {index + 1}º
                        </td>
                        <td className="py-4 px-2 font-bold text-slate-700 print:text-black">
                          {aluno.studentName}
                        </td>
                        <td className="py-4 px-2 font-black text-yellow-500 text-right text-lg print:text-black">
                          {aluno.starsEarned} <span className="print:hidden">⭐</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* RODAPÉ SÓ PARA IMPRESSÃO */}
                <div className="hidden print:block mt-12 text-center text-sm text-gray-500 pt-8 border-t border-gray-300">
                  Documento gerado automaticamente pelo sistema Student Ranking.
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;