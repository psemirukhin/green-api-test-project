import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { getStateInstance } from '../api/greenApi';
import { useApp } from '../context/AppContext';

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
  remember: {
    marginTop: theme.spacing(-0.5),
  },
  submit: {
    marginTop: theme.spacing(1),
  },
}));

const STATE_MESSAGES = {
  notAuthorized: 'Инстанс не авторизован в мессенджере MAX',
  blocked: 'Аккаунт MAX заблокирован',
  starting: 'Инстанс запускается, попробуйте позже',
  pendingPassword: 'Требуется пароль двухфакторной аутентификации',
  suspended:
    'На аккаунте временные ограничения. Вход возможен, но отправка может быть ограничена',
};

export default function LoginScreen() {
  const classes = useStyles();
  const { login } = useApp();

  const [apiUrl, setApiUrl] = useState('');
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const credentials = {
      apiUrl: apiUrl.trim().replace(/\/+$/, ''),
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    };

    if (
      !credentials.apiUrl ||
      !credentials.idInstance ||
      !credentials.apiTokenInstance
    ) {
      setError('Заполните все поля');
      return;
    }

    setLoading(true);

    try {
      const data = await getStateInstance(credentials);
      const state = data.stateInstance;

      if (state === 'authorized' || state === 'suspended') {
        login(credentials, { remember });
        return;
      }

      setError(STATE_MESSAGES[state] || `Неизвестное состояние инстанса: ${state}`);
    } catch (err) {
      if (err.status === 401 || err.status === 403 || err.status === 404) {
        setError('Неверный apiUrl, idInstance или apiTokenInstance');
      } else {
        setError(err.message || 'Ошибка сети. Проверьте соединение и данные');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={classes.root}>
      <Paper className={classes.paper} component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" component="h1">
          Вход
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Введите данные инстанса из личного кабинета GREEN-API
        </Typography>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <TextField
          label="apiUrl"
          value={apiUrl}
          onChange={(event) => setApiUrl(event.target.value)}
          placeholder="https://api.green-api.com"
          fullWidth
          autoComplete="url"
          disabled={loading}
        />
        <TextField
          label="idInstance"
          value={idInstance}
          onChange={(event) => setIdInstance(event.target.value)}
          fullWidth
          autoComplete="username"
          disabled={loading}
        />
        <TextField
          label="apiTokenInstance"
          type="password"
          value={apiTokenInstance}
          onChange={(event) => setApiTokenInstance(event.target.value)}
          fullWidth
          autoComplete="current-password"
          disabled={loading}
        />
        <FormControlLabel
          className={classes.remember}
          control={
            <Checkbox
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              disabled={loading}
            />
          }
          label="Запомнить"
        />
        <Button
          className={classes.submit}
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {loading ? 'Проверка...' : 'Войти'}
        </Button>
      </Paper>
    </Box>
  );
}
