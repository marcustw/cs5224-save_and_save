import { useSelector } from 'react-redux';
import { withAuthenticator } from '@aws-amplify/ui-react';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { Header } from 'ui-component/awsAuth/Header';
import { Footer } from 'ui-component/awsAuth/Footer';
import { UserContextProvider } from 'Contexts/UserContext';
import { Provider } from 'jotai';

// ==============================|| APP ||============================== //

const App = ({ signOut = () => {}, user = {} }) => {
  const customization = useSelector((state) => state.customization);

  return (
    <UserContextProvider user={user} signOut={signOut}>
      <Provider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={themes(customization)}>
            <CssBaseline />
            <NavigationScroll>
              <Routes />
            </NavigationScroll>
          </ThemeProvider>
        </StyledEngineProvider>
      </Provider>
    </UserContextProvider>
  );
};

// export default App;

export default withAuthenticator(App, {
  components: {
    Header,
    Footer
  }
});
