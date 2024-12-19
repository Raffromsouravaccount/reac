import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { store } from './_helpers/store';
import App from './App/App';
import '../public/fonts/fonts.css';
import '../public/css/normalize.css';
import '../public/css/grid.css';
import '../public/css/FormFields.css';
import '../public/css/Style.css';

const theme = createMuiTheme({
  typography: {
    "fontFamily": `"Lato", sans-serif`,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 600,
    "fontWeightBold": 700
   },
   palette: {
    primary: {
      main: '#2e0130'
    }
  }
});
 
render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider >,
  document.getElementById('app')
);