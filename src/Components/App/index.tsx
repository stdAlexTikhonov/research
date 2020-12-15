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
import { Props, ListItemProp } from "./type";
import { Typography } from "@material-ui/core";
import { CustomList } from "../CustomList";

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
  const [dir, setDir] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [list, setList] = useState<ListItemProp[]>([]);
  const [shouldSkipp, setShouldSkipp] = useState<any>(null);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [nextDsb, setNextDsb] = useState<boolean>(false);

  const [itog, setItog] = useState(() => {
    // const transformed = data.map(setInitialData);
    // const res = Object.assign({}, transformed);
    return data;
  });

  useEffect(() => {
    setUuid(uuidv4());
    get("/api/list").then((data) => {
      setList(data);
    });
  }, []);

  const handleData = (code: string) => {
    get(`/api/load?code=${code}`).then((data) => {
      setData(data);
      const test = data.Questionary.reduce(
        (a: any, b: any) => ({
          ...a,
          [`${b.parent_code}`]: a[`${b.parent_code}`]
            ? a[`${b.parent_code}`].concat([b.code])
            : [b.code],
        }),
        {}
      );
      setShouldSkipp(test);
      setTitle(data.caption);
      setKeys(
        Object.keys(data.References)
          .slice(1)
          .sort((a, b) => +a.slice(1) - +b.slice(1))
      );

      setItog(setInitialData(data));
      setList([]);
    });
  };

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
          dir,
          setDir,
          shouldSkipp,
          skipped,
          setSkipped,
          nextDsb,
          setNextDsb,
        }}
      >
        {data && (
          <div className={classes.root}>
            {/* <Header /> */}

            <Typography
              variant="h6"
              gutterBottom
              style={{ padding: 20, paddingBottom: 0, fontSize: 14 }}
            >
              {title}
            </Typography>

            {showCrumbs && <BreadCrumbs len={data.length} setStep={setStep} />}
            <div className={classes.viewer}>
              <Question />
            </div>
            {keys && <Controls setStep={setStep} len={keys.length} />}
          </div>
        )}
        {list && <CustomList list={list} handleData={handleData} />}
      </Context.Provider>
    </ThemeProvider>
  );
};
