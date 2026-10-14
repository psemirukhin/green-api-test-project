import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { makeStyles } from '@mui/styles';
import {
  deleteNotification,
  getIncomingTextMessage,
  receiveNotification,
  sendMessage,
} from '../api/greenApi';
import { useApp } from '../context/AppContext';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.grey[100],
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  actions: {
    display: 'flex',
    gap: theme.spacing(1),
    flexShrink: 0,
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  bubble: {
    maxWidth: '75%',
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.spacing(1.5),
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  bubbleOut: {
    alignSelf: 'flex-end',
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
  bubbleIn: {
    alignSelf: 'flex-start',
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.text.primary,
  },
  composer: {
    padding: theme.spacing(1.5, 2),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  error: {
    marginBottom: theme.spacing(1),
  },
  sendAdornment: {
    marginRight: theme.spacing(0.5),
    alignSelf: 'flex-end',
    marginBottom: theme.spacing(0.5),
  },
  sendButton: {
    '&&': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      width: 32,
      height: 32,
      padding: 0,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
  sendButtonHidden: {
    '&&': {
      visibility: 'hidden',
    },
  },
  sendIcon: {
    fontSize: 18,
  },
}));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ChatScreen() {
  const classes = useStyles();
  const { credentials, chat, closeChat, logout } = useApp();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const poll = async () => {
      while (active) {
        try {
          const notification = await receiveNotification(credentials, {
            receiveTimeout: 5,
            signal: controller.signal,
          });

          if (!active) {
            break;
          }

          if (notification?.receiptId == null) {
            continue;
          }

          const incoming = getIncomingTextMessage(
            notification.body,
            chat.chatId
          );

          if (incoming) {
            setMessages((prev) => {
              if (prev.some((item) => item.id === incoming.id)) {
                return prev;
              }
              return [...prev, incoming];
            });
          }

          await deleteNotification(credentials, notification.receiptId, {
            signal: controller.signal,
          });
        } catch (err) {
          if (!active || err.name === 'AbortError') {
            break;
          }
          await sleep(2000);
        }
      }
    };

    poll();

    return () => {
      active = false;
      controller.abort();
    };
  }, [credentials, chat.chatId]);

  const handleSend = async () => {
    const message = text.trim();
    if (!message || sending) {
      return;
    }

    setError('');
    setSending(true);

    try {
      const data = await sendMessage(credentials, chat.chatId, message);
      setMessages((prev) => [
        ...prev,
        {
          id: data.idMessage || `${Date.now()}`,
          text: message,
          direction: 'out',
        },
      ]);
      setText('');
    } catch (err) {
      setError(err.message || 'Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const canSend = Boolean(text.trim()) && !sending;

  return (
    <Box className={classes.root}>
      <Paper square elevation={0} className={classes.header}>
        <Typography variant="h6" noWrap>
          {chat.phoneNumber || 'Чат'}
        </Typography>
        <Box className={classes.actions}>
          <Button onClick={closeChat} color="inherit" disabled={sending}>
            Новый чат
          </Button>
          <Button onClick={logout} color="inherit" disabled={sending}>
            Выйти
          </Button>
        </Box>
      </Paper>

      <Box className={classes.messages}>
        {messages.length === 0 ? (
          <Typography color="text.secondary">
            Напишите сообщение. Enter — отправить, Shift+Enter — новая строка
          </Typography>
        ) : (
          messages.map((item) => (
            <Box
              key={item.id}
              className={`${classes.bubble} ${
                item.direction === 'in' ? classes.bubbleIn : classes.bubbleOut
              }`}
            >
              <Typography variant="body1" component="span">
                {item.text}
              </Typography>
            </Box>
          ))
        )}
      </Box>

      <Box className={classes.composer}>
        {error ? (
          <Alert className={classes.error} severity="error">
            {error}
          </Alert>
        ) : null}
        <TextField
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Сообщение"
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          disabled={sending}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end" className={classes.sendAdornment}>
                  <IconButton
                    className={`${classes.sendButton}${
                      canSend ? '' : ` ${classes.sendButtonHidden}`
                    }`}
                    onClick={handleSend}
                    tabIndex={canSend ? 0 : -1}
                    aria-label="Отправить"
                    aria-hidden={!canSend}
                  >
                    <ArrowUpwardIcon className={classes.sendIcon} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
    </Box>
  );
}
