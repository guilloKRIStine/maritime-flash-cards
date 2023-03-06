import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

type LoginAlertsProps = {
  alertsState: LoginAlertsState;
  onClose: (alertsState: LoginAlertsState) => void;
};

export type LoginAlertsState = {
  isLoginOrPasswordError: boolean;
};

export const createDefaultState = (): LoginAlertsState => ({
  isLoginOrPasswordError: false,
});

export default function LoginAlerts({
  alertsState,
  onClose,
}: LoginAlertsProps) {
  const handleAlertsClose = () => onClose({ ...createDefaultState() });

  return (
    <Snackbar
      open={alertsState.isLoginOrPasswordError}
      autoHideDuration={5000}
      onClose={handleAlertsClose}
    >
      <Alert variant="filled" severity="error" onClose={handleAlertsClose}>
        Неверный логин или пароль
      </Alert>
    </Snackbar>
  );
}
