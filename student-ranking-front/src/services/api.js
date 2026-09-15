// src/services/api.js

const BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7199';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Usamos a API nativa do navegador para construir cabeçalhos blindados
  const headers = new Headers(options.headers || {});

  // Injeta o token automaticamente se existir
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // O SEGREDO: Só forçamos o tipo JSON se NÃO for um envio de arquivo (FormData).
  // Se for FormData, deixamos o navegador trabalhar sozinho para criar o boundary!
  if (!(options.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
};