import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

type ProfileAlertsProps = {
  alertsState: RegisterAlertsState;
  onClose: (alertsState: RegisterAlertsState) => void;
};

export type RegisterAlertsState = {
  isLoginError: boolean;
};

export const createDefaultState = (): RegisterAlertsState => ({
  isLoginError: false,
});

export default function RegisterAlerts({
  alertsState,
  onClose,
}: ProfileAlertsProps) {
  const handleAlertsClose = () => onClose({ ...createDefaultState() });

  return (
    <Snackbar
      open={alertsState.isLoginError}
      autoHideDuration={5000}
      onClose={handleAlertsClose}
    >
      <Alert variant="filled" severity="error" onClose={handleAlertsClose}>
        Такой логин уже сущестует
      </Alert>
    </Snackbar>
  );
}
