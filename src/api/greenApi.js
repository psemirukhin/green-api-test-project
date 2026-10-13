function normalizeApiUrl(apiUrl) {
  return apiUrl.replace(/\/+$/, '');
}

export function buildApiUrl(credentials, method) {
  const { apiUrl, idInstance, apiTokenInstance } = credentials;
  return `${normalizeApiUrl(apiUrl)}/waInstance${idInstance}/${method}/${apiTokenInstance}`;
}

async function parseJsonResponse(response, fallbackMessage) {
  if (!response.ok) {
    const error = new Error(fallbackMessage);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function getStateInstance(credentials) {
  const response = await fetch(buildApiUrl(credentials, 'getStateInstance'));
  return parseJsonResponse(response, 'Не удалось проверить данные инстанса');
}

export async function checkAccount(credentials, phoneNumber) {
  const response = await fetch(buildApiUrl(credentials, 'checkAccount'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber }),
  });

  return parseJsonResponse(response, 'Не удалось проверить номер телефона');
}

export async function sendMessage(credentials, chatId, message) {
  const response = await fetch(buildApiUrl(credentials, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  });

  return parseJsonResponse(response, 'Не удалось отправить сообщение');
}
