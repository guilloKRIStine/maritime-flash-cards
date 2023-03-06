import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import NavMenu from '~/components/NavMenu';
import '~/styles/globals.css';
import colors from '~/utils/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: colors['primary.1'],
    },
  },
});

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={theme}>
    <Head>
      <title>S.K.Y</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <NavMenu />
    <Component {...pageProps} />
  </ThemeProvider>
);

export default App;
