import { Box, Button, Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
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
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
  },
}));

export default function ChatCreateScreen() {
  const classes = useStyles();
  const { logout } = useApp();

  return (
    <Box className={classes.root}>
      <Paper className={classes.paper}>
        <Box className={classes.header}>
          <Typography variant="h5" component="h1">
            Новый чат
          </Typography>
          <Button onClick={logout} color="inherit">
            Выйти
          </Button>
        </Box>
        <Typography color="text.secondary">
          Экран заготовки: ввод номера получателя появится здесь.
        </Typography>
      </Paper>
    </Box>
  );
}
