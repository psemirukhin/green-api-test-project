import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography variant="h5" component="h1" align="center">
        GREEN-API MAX chat will be here soon
      </Typography>
    </Box>
  );
}
