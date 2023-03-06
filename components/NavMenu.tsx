import { AccountCircle } from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '~/utils/api';
import colors from '~/utils/colors';
import paths from '~/utils/paths';

const buttonStyles: SxProps<Theme> = {
  color: 'white',
  borderRadius: '15px',
  margin: '10px',
  padding: '10px 15px',
  textTransform: 'none',
  fontSize: 'x-large',
  fontWeight: 'bold',
  lineHeight: 1.25,
};

const NavMenu = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(api.user.isAuthenticated());
    const subscriptionId = api.user.subscribe(() =>
      setIsAuthenticated(api.user.isAuthenticated())
    );
    return () => api.user.unsubscribe(subscriptionId);
  }, []);

  return (
    <AppBar
      position="static"
      sx={{
        height: '124px',
        bgcolor: colors['primary.2'],
        justifyContent: 'center',
      }}
    >
      <Toolbar
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
        }}
      >
        {isAuthenticated ? (
          <Button
            sx={{ ...buttonStyles, width: 'fit-content' }}
            onClick={() => router.push(paths.myDecks)}
            children="Мои наборы"
          />
        ) : (
          <div />
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 50ms ease-out',
            userSelect: 'none',
            ':active': {
              transform: 'translate(0%, 5%)',
            },
          }}
          onClick={() => router.push(paths.main)}
        >
          <Image
            priority
            src="/logo.png"
            alt="logo"
            width={250}
            height={100}
            style={{ pointerEvents: 'none', objectFit: 'contain' }}
          />
        </Box>

        <LoginMenu />
      </Toolbar>
    </AppBar>
  );
};

const LoginMenu = () => {
  const router = useRouter();
  const [loginState, setLoginState] = useState({
    isAuthenticated: false,
    userName: '',
  });
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement>();

  useEffect(() => {
    const populateState = async () => {
      const user = api.user.getUser();
      setLoginState({
        isAuthenticated: api.user.isAuthenticated(),
        userName: user ? user.userName : '',
      });
    };
    populateState();
    const subscriptionId = api.user.subscribe(populateState);
    return () => api.user.unsubscribe(subscriptionId);
  }, []);

  const openMenu = (e: React.MouseEvent<HTMLElement>) =>
    setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(undefined);

  const openProfile = () => {
    closeMenu();
    router.push(paths.profile);
  };

  const profileLogout = () => {
    closeMenu();
    api.user.logout();
    api.decks.resetLocalRepository();
    api.cards.resetLocalRepository();
    router.push(paths.main);
  };

  if (loginState.isAuthenticated && loginState.userName) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          sx={buttonStyles}
          className={menuAnchor ? 'active' : ''}
          onClick={openMenu}
        >
          {loginState.userName}
          <AccountCircle
            sx={{ marginLeft: '10px', width: '60px', height: '60px' }}
            className="icon"
          />
        </Button>
        <Menu
          sx={{ marginBottom: '10px' }}
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={closeMenu}
        >
          <MenuItem onClick={openProfile} children="Профиль" />
          <MenuItem onClick={profileLogout} children="Выйти" />
        </Menu>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        sx={buttonStyles}
        children="Регистрация"
        onClick={() => router.push(paths.register)}
      />
      <Button
        sx={buttonStyles}
        children="Вход"
        onClick={() => router.push(paths.login)}
      />
    </Box>
  );
};

export default NavMenu;
