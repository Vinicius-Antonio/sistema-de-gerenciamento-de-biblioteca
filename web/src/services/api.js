const API_URL = 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const token = localStorage.getItem('biblioteca_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = response.status !== 204 ? await response.json() : null;

    if (!response.ok) {
      throw new Error(data?.message || data?.error || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
