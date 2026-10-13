import { Box, Button, Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
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
  content: {
    flex: 1,
    padding: theme.spacing(2),
  },
}));

export default function ChatScreen() {
  const classes = useStyles();
  const { chat, closeChat, logout } = useApp();

  return (
    <Box className={classes.root}>
      <Paper square elevation={0} className={classes.header}>
        <Typography variant="h6" noWrap>
          {chat.phoneNumber || 'Чат'}
        </Typography>
        <Box className={classes.actions}>
          <Button onClick={closeChat} color="inherit">
            Новый чат
          </Button>
          <Button onClick={logout} color="inherit">
            Выйти
          </Button>
        </Box>
      </Paper>
      <Box className={classes.content}>
        <Typography color="text.secondary">
          Экран заготовки: список сообщений и поле ввода появятся здесь.
        </Typography>
      </Box>
    </Box>
  );
}
