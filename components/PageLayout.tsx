import Box, { BoxProps } from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import colors from '~/utils/colors';

type Props = {
  isLoading?: boolean;
  isNotFound?: boolean;
  componentNotFound?: JSX.Element;
} & BoxProps;

const PageLayout = ({
  isLoading,
  isNotFound,
  componentNotFound,
  children,
  ...props
}: Props) => (
  <Box
    minHeight="calc(100vh - 124px)"
    display="flex"
    justifyContent="center"
    {...props}
  >
    {isNotFound && !isLoading ? componentNotFound : null}
    {isLoading ? (
      <CircularProgress
        size={100}
        sx={{
          position: 'fixed',
          top: '50%',
          left: '48%',
        }}
      />
    ) : !isNotFound ? (
      children
    ) : null}
  </Box>
);

export default PageLayout;
