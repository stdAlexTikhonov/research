import React, { useState, useMemo, useEffect } from "react";
import { useStyles } from "./styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Header } from "../Header";
import { Context } from "../../context";
import { Controls } from "../Controls";
import { BreadCrumbs } from "../BreadCrumbs";
import { getData } from "../../utils/Data";
import { get } from "../../utils/api";
import { DenseTable } from "../Table";
import { Question } from "../Question";
import { Answers } from "../Answers";
import { MultipleAns } from "../MultipleAns";
import { Props } from "./type";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2959B2",
    },
  },
});

const setInitialData = (datum: any) => {
  if (datum.multiple)
    return Object.assign({}, Array(datum.answers.length).fill(false));
  else if (datum.variants)
    return Object.assign({}, Array(datum.answers.length).fill(""));
  else return null;
};

export const App: React.FC<Props> = () => {
  const classes = useStyles();
  const [step, setStep] = useState<number>(0);
  const [data, setData] = useState<any>(null);
  const [keys, setKeys] = useState<any>(null);
    

  const [itog, setItog] = useState(() => {
    // const transformed = data.map(setInitialData);
    // const res = Object.assign({}, transformed);
    return data;
  });

  useEffect(() => {
    get("/api/load").then(data => {
      setData(data);
      setKeys(Object.keys(data.References).slice(1).sort((a,b) => +(a.slice(1)) - +(b.slice(1))))
    });
  }, []);


  const [showCrumbs, setShowCrumbs] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider
        value={{ step, itog, setItog, showCrumbs, setShowCrumbs, data, keys }}
      >
        {data && <div className={classes.root}>
          <Header />
          {showCrumbs && <BreadCrumbs len={data.length} setStep={setStep} />}
          <div className={classes.viewer}>
            <Question />
            {/* {data[step].variants ? (
              <DenseTable
                answers={data[step].answers}
                variants={data[step].variants!}
              />
            ) : (
              <div className={classes.answers}>
                {data[step].multiple ? (
                  <MultipleAns
                    {...data[step]}
                    user_input={!!data[step].user_answer}
                  />
                ) : (
                  <Answers
                    {...data[step]}
                    user_input={!!data[step].user_answer}
                  />
                )}
              </div>
            )} */}
          </div>
          {keys && <Controls setStep={setStep} len={keys.length} />}
        </div>}
      </Context.Provider>
    </ThemeProvider>
  );
};
