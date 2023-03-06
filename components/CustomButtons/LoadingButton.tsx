import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

type Props = {
  isLoading?: boolean;
} & ButtonProps;

export const LoadingButton = ({
  isLoading = false,
  children,
  ...props
}: Props) => (
  <Button disabled={isLoading} {...props}>
    {isLoading ? (
      <CircularProgress sx={{ color: 'white' }} size={25} />
    ) : (
      children
    )}
  </Button>
);
