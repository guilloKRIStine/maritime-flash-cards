import { ChangeEvent, Fragment, useState } from 'react';
import { AccountCircle } from '@mui/icons-material';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { useRouter } from 'next/router';
import LoginAlerts, {
  LoginAlertsState,
  createDefaultState,
} from '~/components/Alerts/LoginAlerts';
import api from '~/utils/api';
import paths from '~/utils/paths';
import { RequiredValidator } from '~/utils/validators/Validators';
import { RequiredErrorMessage } from '~/utils/validators/ErrorMessage';
import InputAdornment from '@mui/material/InputAdornment';
import PasswordInput from '~/components/PasswordInput';
import { LoadingButton } from '~/components/CustomButtons/LoadingButton';
import PageLayout from '~/components/PageLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type LoginForm = {
  login: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState<LoginForm>({
    login: '',
    password: '',
  });
  const [alertsState, setAlertsState] = useState<LoginAlertsState>(
    createDefaultState()
  );
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    const isSuccess = await api.user.login(loginForm.login, loginForm.password);
    if (isSuccess) {
      router.push(paths.main);
    } else {
      setIsLoading(false);
      setAlertsState({ ...alertsState, isLoginOrPasswordError: true });
    }
  };

  return (
    <PageLayout alignItems="center">
      <Box
        bgcolor="white"
        margin="50px"
        padding="30px 60px"
        borderRadius="50px"
        sx={{
          '.MuiFormControl-root': { margin: '10px' },
        }}
      >
        <ValidatorForm onSubmit={onSubmit}>
          <Typography
            variant="h3"
            margin="20px"
            textAlign="center"
            fontSize="24px"
            fontWeight="bold"
            children="Вход в аккаунт"
          />
          <TextValidator
            label="Логин"
            variant="outlined"
            type="text"
            name="login"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setLoginForm({ ...loginForm, login: e.currentTarget.value })
            }
            value={loginForm.login}
            validators={RequiredValidator}
            errorMessages={RequiredErrorMessage}
            InputProps={{
              sx: { width: '350px' },
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
          <PasswordInput
            label="Пароль"
            name="password"
            value={loginForm.password}
            validators={RequiredValidator}
            errorMessages={RequiredErrorMessage}
            sx={{ width: '350px' }}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.currentTarget.value })
            }
          />
          <LoadingButton
            isLoading={isLoading}
            type="submit"
            variant="contained"
            children="Войти"
            sx={{
              margin: '35px',
              fontWeight: 'bold',
              fontSize: 'larger',
              textTransform: 'none',
              width: '300px',
              height: '50px',
            }}
          />
        </ValidatorForm>
      </Box>
      <LoginAlerts alertsState={alertsState} onClose={setAlertsState} />
    </PageLayout>
  );
};

export default Login;
