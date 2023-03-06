import { AccountCircle } from '@mui/icons-material';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import RegisterAlerts, {
  RegisterAlertsState,
  createDefaultState,
} from '~/components/Alerts/RegisterAlerts';
import { LoadingButton } from '~/components/CustomButtons/LoadingButton';
import PageLayout from '~/components/PageLayout';
import PasswordInput from '~/components/PasswordInput';
import api from '~/utils/api';
import paths from '~/utils/paths';
import {
  PasswordErrorMessages,
  RepeatPasswordErrorMessages,
  RequiredErrorMessage,
} from '~/utils/validators/ErrorMessage';
import {
  PasswordValidators,
  RepeatPasswordValidators,
  RequiredValidator,
} from '~/utils/validators/Validators';

type RegisterFormData = {
  login: string;
  password: string;
  repeatPassword: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    login: '',
    password: '',
    repeatPassword: '',
  });
  const [alertsState, setAlertsState] = useState<RegisterAlertsState>(
    createDefaultState()
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordMatch', (value: string) => {
      return value === registerForm.password;
    });

    return () => {
      ValidatorForm.removeValidationRule('isPasswordMatch');
    };
  }, [registerForm.password]);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      await api.user.register(
        registerForm.login,
        registerForm.password,
        registerForm.repeatPassword
      );
      router.push(paths.main);
    } catch {
      setIsLoading(false);
      setAlertsState({ ...alertsState, isLoginError: true });
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
        <ValidatorForm onSubmit={onSubmit} instantValidate={false}>
          <Typography
            variant="h3"
            margin="20px"
            textAlign="center"
            fontSize="24px"
            fontWeight="bold"
            children="Создать новый аккаунт"
          />
          <TextValidator
            label="Логин"
            variant="outlined"
            type="text"
            name="login"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRegisterForm({ ...registerForm, login: e.target.value })
            }
            value={registerForm.login}
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
            value={registerForm.password}
            onChange={(e) =>
              setRegisterForm({
                ...registerForm,
                password: e.currentTarget.value,
              })
            }
            validators={PasswordValidators}
            errorMessages={PasswordErrorMessages}
            sx={{ width: '350px' }}
          />
          <PasswordInput
            label="Повторите пароль"
            name="repeat-password"
            value={registerForm.repeatPassword}
            onChange={(e) => {
              setRegisterForm({
                ...registerForm,
                repeatPassword: e.currentTarget.value,
              });
            }}
            validators={RepeatPasswordValidators}
            errorMessages={RepeatPasswordErrorMessages}
            sx={{ width: '350px' }}
          />
          <LoadingButton
            isLoading={isLoading}
            type="submit"
            children="Зарегистрироваться"
            sx={{
              margin: '35px',
              bgcolor: 'green',
              color: 'white',
              fontWeight: 'bold',
              fontSize: 'larger',
              textTransform: 'none',
              width: '300px',
              height: '50px',
              ':hover': { bgcolor: 'rgb(0, 92, 0)' },
            }}
          />
        </ValidatorForm>
      </Box>
      <RegisterAlerts alertsState={alertsState} onClose={setAlertsState} />
    </PageLayout>
  );
};

export default RegisterPage;
