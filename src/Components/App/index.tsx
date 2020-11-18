import React, { useState } from "react";
import { useStyles } from "./styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Header } from "../Header";
import { Context } from "../../context";
import { Controls } from "../Controls";
import { getData } from "../../utils/Data";
import { Typography } from "@material-ui/core";
import { Answer } from "../Answer";
import RadioGroup from "@material-ui/core/RadioGroup";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2959B2",
    },
  },
});

type Data = {
  question: string;
  answers: string[];
};

export const App = () => {
  const classes = useStyles();
  const [step, setStep] = useState<number>(0);
  const [data, setData] = useState<Data[]>(() => getData());
  const [value, setValue] = React.useState();

  const handleChange = () => alert("change");

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider value={step}>
        <div className={classes.root}>
          <Header />
          <div className={classes.viewer}>
            <Typography variant="h5" gutterBottom>
              {data[step].question}
            </Typography>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={value}
              onChange={handleChange}
            >
              {data[step].answers.map((answer: string) => (
                <Answer title={answer} />
              ))}
            </RadioGroup>
          </div>
          <Controls setStep={setStep} len={data.length} />
        </div>
      </Context.Provider>
    </ThemeProvider>
  );
};
