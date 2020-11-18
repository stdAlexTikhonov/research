import React, { useState } from "react";
import { useStyles } from "./styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Header } from "../Header";
import { Context } from "../../context";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2959B2",
    },
  },
});

export const App = () => {
  const classes = useStyles();
  const [step, setStep] = useState<number>(0);

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider value={step}>
        <div className={classes.root}>
          <Header />
        </div>
      </Context.Provider>
    </ThemeProvider>
  );
};
