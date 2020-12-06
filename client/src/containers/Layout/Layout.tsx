import { FC } from 'react';
import { useSelector } from 'react-redux';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';

import { Appbar } from './Appbar/Appbar';
import { Sidebar } from './Sidebar/Sidebar';
import { MainContainer } from './MainContainer/MainContainer';
import Notifier from '../Notifier/Notifier';
import { RootState } from 'store/store';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    sizes: {
      drawer: number;
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    sizes?: {
      drawer?: number;
    };
  }
}

const drawerWidth = 240;
const disabledColor = 'rgba(0, 0, 0, 0.52)';

const theme = createMuiTheme({
  sizes: {
    drawer: drawerWidth
  },
  palette: {
    text: {
      disabled: disabledColor
    }
  }
});

export const Layout: FC = ({ children }) => {
  const { accessToken, role } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = Boolean(accessToken);
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <Notifier />
        <Appbar isAuthenticated={isAuthenticated} />
        {isAuthenticated && role ? <Sidebar userRole={role} /> : null}
        <MainContainer>{children}</MainContainer>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
