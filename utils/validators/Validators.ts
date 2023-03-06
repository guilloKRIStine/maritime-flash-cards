export const RequiredValidator = ['required'];

export const PasswordValidators = [
  'required',
  'minStringLength:8',
  'matchRegexp:(?=.*[0-9])',
  'matchRegexp:(?=.*[a-z])',
  'matchRegexp:(?=.*[A-Z])',
];

export const RepeatPasswordValidators = ['required', 'isPasswordMatch'];

export const DeckNameValidators = [
  'required',
  'matchRegexp:^[a-zA-Zа-яА-ЯёЁ0-9 ]*$',
];

export const DeckDescriptionValidators = ['maxStringLength:150'];

export const CardWordValidators = [
  'required',
  'matchRegexp:^[a-zA-Zа-яА-ЯёЁ0-9 ]*$',
  'maxStringLength:100',
];
