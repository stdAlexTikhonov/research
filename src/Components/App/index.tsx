import React, { useState, useEffect } from "react";
import { useStyles } from "./styles";
import { Header } from "../Header";
import { Context } from "../../context";
import { Controls } from "../Controls";
import { BreadCrumbs } from "../BreadCrumbs";
import { get, uuidv4, commonTransform } from "../../utils/api";
import { Question } from "../Question";
import { Props, ListItemProp } from "./type";
import { Typography } from "@material-ui/core";
import { CustomList } from "../CustomList";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { AGAIN_AND_AGAIN } from "../../utils/constants";

const setInitialData = (datum: any) =>
  datum.Questionary.reduce(function (result: any, item: any, index: number) {
    result[item.code] = {
      answers: item.multiple_values
        ? item.default_value || [null]
        : item.default_value || null,
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
  const [title, setTitle] = useState<string>("");
  const [list, setList] = useState<ListItemProp[]>([]);
  const [shouldSkipp, setShouldSkipp] = useState<any>(null);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [nextDsb, setNextDsb] = useState<boolean>(true);
  const [refuse, setRefuse] = useState(false);
  const [itog, setItog] = useState();
  const [localKeys, setLocalKeys] = useState<string[]>([]);

  useEffect(() => {
    const uuidFromStorage = localStorage.getItem("uuid");
    if (uuidFromStorage) {
      setUuid(uuidFromStorage);
      const dataFromStorage = localStorage.getItem(uuidFromStorage);
      const parsed = JSON.parse(dataFromStorage!);
      setData(parsed);

      //
      const itog = commonTransform(parsed);

      setShouldSkipp(itog);
      setTitle(parsed.caption);
      setKeys(
        Object.keys(parsed.References)
          .slice(1)
          .sort((a, b) => +a.slice(1) - +b.slice(1))
      );
      const get_itog = localStorage.getItem(`itog_${uuidFromStorage}`);
      if (get_itog) {
        setItog(JSON.parse(get_itog));
        const step_ = localStorage.getItem(`step_${uuidFromStorage}`);
        setStep(parseInt(step_!));
      } else setItog(setInitialData(parsed));
    } else {
      get("/api/list").then((data) => {
        setList(data);
      });
    }
  }, []);

  const handleData = (code: string) => {
    const year = localStorage.getItem(code);
    if (year) setRefuse(true);
    else {
      const id = uuidv4();
      setUuid(id);
      localStorage.setItem("uuid", id);
      get(`/api/load?code=${code}`).then((data) => {
        localStorage.setItem(id, JSON.stringify(data));
        setData(data);

        const itog = commonTransform(data);

        setShouldSkipp(itog);
        setTitle(data.caption);
        setKeys(
          Object.keys(data.References)
            .slice(1)
            .sort((a, b) => +a.slice(1) - +b.slice(1))
        );

        setItog(setInitialData(data));
        setList([]);
      });
    }
  };

  const [showCrumbs, setShowCrumbs] = useState(false);

  return (
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
        shouldSkipp,
        skipped,
        setSkipped,
        nextDsb,
        setNextDsb,
        localKeys,
        setLocalKeys,
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
      {list.length > 0 && <CustomList list={list} handleData={handleData} />}
      <Dialog
        aria-labelledby="simple-dialog-title"
        open={refuse}
        onClose={() => setRefuse(false)}
      >
        <DialogTitle id="simple-dialog-title">{AGAIN_AND_AGAIN}</DialogTitle>
      </Dialog>
    </Context.Provider>
  );
};
