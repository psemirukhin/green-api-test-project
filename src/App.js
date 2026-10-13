import { useApp } from './context/AppContext';
import LoginScreen from './screens/LoginScreen';
import ChatCreateScreen from './screens/ChatCreateScreen';

export default function App() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <ChatCreateScreen />;
}
