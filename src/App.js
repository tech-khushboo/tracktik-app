import React from "react";
import { Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Header from "./components/Header";
import Sites from "./containers/Sites";
import SiteDetails from "./containers/SiteDetails";
import './App.css';

const theme = createTheme();

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Header />
        <div style={{ clear: "both", minHeight: '80vh' }}>
            <Route exact path="/" component={Sites} />
            <Route exact path="/sites" component={Sites} />
            <Route exact path="/sites/:id" component={SiteDetails} />
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
