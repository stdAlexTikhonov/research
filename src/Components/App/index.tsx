import React from "react";
import { useStyles } from "./styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Header } from "../Header";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2959B2",
    },
  },
});

export const App = () => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Header />
      </div>
    </ThemeProvider>
  );
};
