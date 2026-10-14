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

export async function receiveNotification(
  credentials,
  { receiveTimeout = 5, signal } = {}
) {
  const url = `${buildApiUrl(
    credentials,
    'receiveNotification'
  )}?receiveTimeout=${receiveTimeout}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    const error = new Error('Не удалось получить уведомление');
    error.status = response.status;
    throw error;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  return JSON.parse(text);
}

export async function deleteNotification(credentials, receiptId, { signal } = {}) {
  const response = await fetch(
    `${buildApiUrl(credentials, 'deleteNotification')}/${receiptId}`,
    {
      method: 'DELETE',
      signal,
    }
  );

  return parseJsonResponse(response, 'Не удалось удалить уведомление');
}

export function getIncomingTextMessage(body, chatId) {
  if (!body || body.typeWebhook !== 'incomingMessageReceived') {
    return null;
  }

  if (body.messageData?.typeMessage !== 'textMessage') {
    return null;
  }

  if (String(body.senderData?.chatId) !== String(chatId)) {
    return null;
  }

  const text = body.messageData?.textMessageData?.textMessage;
  if (!text) {
    return null;
  }

  return {
    id: body.idMessage || String(body.timestamp || Date.now()),
    text,
    direction: 'in',
  };
}
