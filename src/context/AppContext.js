import { createContext, useContext, useState } from 'react';

const STORAGE_KEY = 'green-api-credentials';

const emptyCredentials = () => ({
  apiUrl: '',
  idInstance: '',
  apiTokenInstance: '',
});

const emptyChat = () => ({
  chatId: '',
  phoneNumber: '',
});

const readStoredCredentials = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyCredentials();
    }
    const parsed = JSON.parse(raw);
    return {
      apiUrl: parsed.apiUrl || '',
      idInstance: parsed.idInstance || '',
      apiTokenInstance: parsed.apiTokenInstance || '',
    };
  } catch {
    return emptyCredentials();
  }
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [credentials, setCredentialsState] = useState(readStoredCredentials);
  const [chat, setChatState] = useState(emptyChat);

  const isAuthenticated = Boolean(
    credentials.apiUrl &&
      credentials.idInstance &&
      credentials.apiTokenInstance
  );

  const hasChat = Boolean(chat.chatId);

  const login = (next, { remember = false } = {}) => {
    const value = {
      apiUrl: next.apiUrl.trim().replace(/\/+$/, ''),
      idInstance: next.idInstance.trim(),
      apiTokenInstance: next.apiTokenInstance.trim(),
    };
    setCredentialsState(value);

    if (remember) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const openChat = ({ chatId, phoneNumber }) => {
    setChatState({
      chatId: String(chatId),
      phoneNumber: String(phoneNumber),
    });
  };

  const closeChat = () => {
    setChatState(emptyChat());
  };

  const logout = () => {
    setCredentialsState(emptyCredentials());
    setChatState(emptyChat());
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        credentials,
        isAuthenticated,
        chat,
        hasChat,
        login,
        logout,
        openChat,
        closeChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
