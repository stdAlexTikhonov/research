import React, { useState, useMemo } from "react";
import { useStyles } from "./styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Header } from "../Header";
import { Context } from "../../context";
import { Controls } from "../Controls";
import { BreadCrumbs } from "../BreadCrumbs";
import { getData } from "../../utils/Data";
import { Answer, CheckboxAns } from "../Answer";
import { DenseTable } from "../Table";
import { Title } from "../Title";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormGroup from "@material-ui/core/FormGroup";

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
  const [value, setValue] = useState<string>("1");
  const [showCrumbs, setShowCrumbs] = useState(false);

  const handleChange = (e: any) => setValue(e.target.value);

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider
        value={{ step, itog, setItog, showCrumbs, setShowCrumbs, data }}
      >
        <div className={classes.root}>
          <Header />
          {showCrumbs && <BreadCrumbs len={data.length} setStep={setStep} />}
          <div className={classes.viewer}>
            <Title />
            {data[step].variants ? (
              <DenseTable
                answers={data[step].answers}
                variants={data[step].variants!}
              />
            ) : (
              <div className={classes.answers}>
                {data[step].multiple ? (
                  <FormGroup>
                    {data[step].answers.map((answer: string, index: number) => (
                      <CheckboxAns title={answer} key={index} value={index} />
                    ))}
                  </FormGroup>
                ) : (
                  <RadioGroup
                    name={data[step].id}
                    value={value}
                    onChange={handleChange}
                  >
                    {data[step].answers.map((answer: string, index: number) => (
                      <Answer title={answer} key={index} value={index} />
                    ))}
                  </RadioGroup>
                )}
              </div>
            )}
          </div>
          <Controls setStep={setStep} len={data.length} />
        </div>
      </Context.Provider>
    </ThemeProvider>
  );
};
