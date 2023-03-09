import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import colors from '~/utils/colors';

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
      <CircularProgress sx={{ color: colors['primary.1'] }} size={25} />
    ) : (
      children
    )}
  </Button>
);
