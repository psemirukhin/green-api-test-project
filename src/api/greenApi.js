function normalizeApiUrl(apiUrl) {
  return apiUrl.replace(/\/+$/, '');
}

export function buildApiUrl(credentials, method) {
  const { apiUrl, idInstance, apiTokenInstance } = credentials;
  return `${normalizeApiUrl(apiUrl)}/waInstance${idInstance}/${method}/${apiTokenInstance}`;
}

export async function getStateInstance(credentials) {
  const response = await fetch(buildApiUrl(credentials, 'getStateInstance'));

  if (!response.ok) {
    const error = new Error('Не удалось проверить данные инстанса');
    error.status = response.status;
    throw error;
  }

  return response.json();
}
