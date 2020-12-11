import React, { useState, useEffect } from "react";
import { useStyles } from "./styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Header } from "../Header";
import { Context } from "../../context";
import { Controls } from "../Controls";
import { BreadCrumbs } from "../BreadCrumbs";
import { get, uuidv4 } from "../../utils/api";
import { Question } from "../Question";
import { Props } from "./type";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2959B2",
    },
  },
});

const setInitialData = (datum: any) =>
  datum.Questionary.reduce(function (result: any, item: any, index: number) {
    result[item.code] = {
      answers: item.multiple_values ? [null] : null,
      other: "",
    }; //a, b, c
    return result;
  }, {});

export const App: React.FC<Props> = () => {
  const classes = useStyles();
  const [step, setStep] = useState<number>(0);
  const [data, setData] = useState<any>(null);
  const [keys, setKeys] = useState<any>(null);
  const [uuid, setUuid] = useState<string>("");

  const [itog, setItog] = useState(() => {
    // const transformed = data.map(setInitialData);
    // const res = Object.assign({}, transformed);
    return data;
  });

  useEffect(() => {
    setUuid(uuidv4());
    get("/api/load").then((data) => {
      setData(data);
      setKeys(
        Object.keys(data.References)
          .slice(1)
          .sort((a, b) => +a.slice(1) - +b.slice(1))
      );

      setItog(setInitialData(data));
    });
  }, []);

  const [showCrumbs, setShowCrumbs] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider
        value={{
          step,
          itog,
          setItog,
          showCrumbs,
          setShowCrumbs,
          data,
          keys,
          uuid,
          setStep,
        }}
      >
        {data && (
          <div className={classes.root}>
            {/* <Header /> */}
            {showCrumbs && <BreadCrumbs len={data.length} setStep={setStep} />}
            <div className={classes.viewer}>
              <Question />
            </div>
            {keys && <Controls setStep={setStep} len={keys.length} />}
          </div>
        )}
      </Context.Provider>
    </ThemeProvider>
  );
};
