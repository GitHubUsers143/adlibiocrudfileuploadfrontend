// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';

import { Provider } from 'react-redux';
import { store } from './redux/store';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <Router />
      </Provider>
    </ThemeProvider>
  );
}
