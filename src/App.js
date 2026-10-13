import { useApp } from './context/AppContext';
import LoginScreen from './screens/LoginScreen';
import ChatCreateScreen from './screens/ChatCreateScreen';
import ChatScreen from './screens/ChatScreen';

export default function App() {
  const { isAuthenticated, hasChat } = useApp();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  if (!hasChat) {
    return <ChatCreateScreen />;
  }

  return <ChatScreen />;
}
