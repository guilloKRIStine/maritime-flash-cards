import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { FormEvent, useState } from 'react';
import { TextValidator } from 'react-material-ui-form-validator';

type Props = {
  label: string;
  name: string;
  sx?: SxProps<Theme>;
  value?: string;
  onChange?: (e: FormEvent<HTMLInputElement>) => void;
  validators?: string[];
  errorMessages?: string[];
};

const PasswordInput = ({
  label,
  sx,
  name,
  value,
  onChange,
  validators,
  errorMessages,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextValidator
      variant="outlined"
      label={label}
      name={name}
      onChange={onChange}
      value={value}
      validators={validators}
      errorMessages={errorMessages}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        sx,
        startAdornment: (
          <InputAdornment position="start">
            <Lock />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              children={showPassword ? <Visibility /> : <VisibilityOff />}
            />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordInput;
