import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { SxProps, Theme } from '@mui/material/styles';
import { ReactNode } from 'react';

type Props = {
  sx?: SxProps<Theme>;
  isLoading?: boolean;
  isNotFound?: boolean;
  componentNotFound?: JSX.Element;
  children: ReactNode;
};

const PageLayout = ({
  sx,
  isLoading,
  isNotFound,
  componentNotFound,
  children,
}: Props) => (
  <Box sx={sx}>
    {isNotFound && !isLoading ? componentNotFound : null}
    {isLoading ? (
      <CircularProgress
        size={100}
        sx={{ position: 'fixed', top: '50%', left: '48%', color: '#253C88' }}
      />
    ) : !isNotFound ? (
      children
    ) : null}
  </Box>
);

export default PageLayout;
