import React, { useState, useMemo } from "react";
import { useStyles } from "./styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Header } from "../Header";
import { Context } from "../../context";
import { Controls } from "../Controls";
import { BreadCrumbs } from "../BreadCrumbs";
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

export const App = () => {
  const classes = useStyles();
  const [step, setStep] = useState<number>(0);
  const [itog, setItog] = useState({});
  const data = useMemo(() => getData(), []);
  const [value, setValue] = useState<string>();
  const [showCrumbs, setShowCrumbs] = useState(false);

  const handleChange = (val: string) => setValue(val);

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider
        value={{ step, itog, setItog, showCrumbs, setShowCrumbs }}
      >
        <div className={classes.root}>
          <Header />
          {showCrumbs && <BreadCrumbs len={data.length} setStep={setStep} />}
          <div className={classes.viewer}>
            <div>
              <Typography variant="overline" display="block" gutterBottom>
                Вопрос № {step + 1}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {data[step].question}
              </Typography>
              {data[step].subtitle && (
                <Typography variant="caption" display="block" gutterBottom>
                  {data[step].subtitle}
                </Typography>
              )}
              <RadioGroup
                aria-label="gender"
                name="gender1"
                value={value}
                onChange={() => handleChange}
              >
                {data[step].answers.map((answer: string, index: number) => (
                  <Answer title={answer} key={index} />
                ))}
              </RadioGroup>
            </div>
          </div>
          <Controls setStep={setStep} len={data.length} />
        </div>
      </Context.Provider>
    </ThemeProvider>
  );
};
