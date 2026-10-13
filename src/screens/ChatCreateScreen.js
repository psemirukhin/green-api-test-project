import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { checkAccount } from '../api/greenApi';
import { useApp } from '../context/AppContext';
import { normalizePhoneNumber } from '../utils/phone';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
  },
  paper: {
    padding: theme.spacing(3),
    width: '100%',
    maxWidth: 420,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(1),
  },
}));

export default function ChatCreateScreen() {
  const classes = useStyles();
  const { credentials, logout, openChat } = useApp();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const normalized = normalizePhoneNumber(phone);
    if (normalized.error) {
      setError(normalized.error);
      return;
    }

    setLoading(true);

    try {
      const data = await checkAccount(credentials, normalized.phoneNumber);

      if (data.status === false) {
        setError(data.reason || 'Не удалось проверить номер');
        return;
      }

      if (!data.exist || !data.chatId) {
        setError('Аккаунт MAX на этом номере не найден');
        return;
      }

      openChat({
        chatId: data.chatId,
        phoneNumber: String(normalized.phoneNumber),
      });
    } catch (err) {
      if (err.status === 400) {
        setError('Неверный формат номера телефона');
      } else if (err.status === 469) {
        setError(
          'Слишком много проверок номеров. Подождите и попробуйте позже'
        );
      } else {
        setError(err.message || 'Ошибка сети. Проверьте соединение');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={classes.root}>
      <Paper className={classes.paper} component="form" onSubmit={handleSubmit}>
        <Box className={classes.header}>
          <Typography variant="h5" component="h1">
            Новый чат
          </Typography>
          <Button onClick={logout} color="inherit" disabled={loading}>
            Выйти
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Введите номер получателя
        </Typography>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <TextField
          label="Номер телефона"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="79991234567"
          fullWidth
          autoComplete="tel"
          disabled={loading}
        />
        <Button
          className={classes.submit}
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {loading ? 'Проверка...' : 'Создать чат'}
        </Button>
      </Paper>
    </Box>
  );
}
