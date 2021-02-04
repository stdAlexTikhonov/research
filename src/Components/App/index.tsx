import React, { useState, useEffect } from "react";
import { useStyles } from "./styles";
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
import { isMobile } from "../../utils/helpers";
import { AGAIN_AND_AGAIN } from "../../utils/constants";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { Header } from "../Header";

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

export const App: React.FC<Props> = ({ showHeader }) => {
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
  const [localKeys, setLocalKeys] = useState<any>(null);
  const [itogKeys, setItogKeys] = useState<string[] | null>(null);
  const [questionCode, setQuestionCode] = useState<string>("");
  const [direction, setDirection] = useState<number>(1);
  const [questionary_code, setQuestionaryCode] = useState<string>("");
  const [reset, setReset] = useState<boolean>(false);

  useEffect(() => {
    const uuidFromStorage = localStorage.getItem("uuid");
    if (uuidFromStorage) {
      setUuid(uuidFromStorage);
      const dataFromStorage = localStorage.getItem(uuidFromStorage);
      const parsed = JSON.parse(dataFromStorage!);
      setData(parsed);

      const itog = commonTransform(parsed);

      setShouldSkipp(itog);
      setTitle(parsed.caption);
      const question_keys: { [key: string]: null } = {};
      parsed.Questionary.forEach((item: any) => {
        question_keys[`${item.question}`] = null;
      });
      const keys_ = Object.keys(question_keys);

      setLocalKeys(keys_);
      setKeys(keys_);
      const get_itog = localStorage.getItem(`itog_${uuidFromStorage}`);
      if (get_itog) {
        const parsed = JSON.parse(get_itog);
        setItog(parsed);
        setItogKeys(Object.keys(parsed));
        const step_ = localStorage.getItem(`step_${uuidFromStorage}`);
        /////
        const key = keys_[parseInt(step_!)];
        ////
        setStep(parseInt(step_!));
      } else {
        const itog = setInitialData(parsed);
        setItog(itog);
        setItogKeys(Object.keys(itog));
      }
    } else {
      get("/api/list").then((data_local) => {
        setList(data_local);
      });
    }
  }, [reset]);

  const handleData = (code: string) => {
    const year = localStorage.getItem(code);
    setQuestionaryCode(code);
    if (year) setRefuse(true);
    else {
      const id = uuidv4();
      setUuid(id);
      localStorage.setItem("uuid", id);
      get(`/api/load?code=${code}`).then((local_data) => {
        localStorage.setItem(id, JSON.stringify(local_data));
        setData(local_data);
        const itog = commonTransform(local_data);

        setShouldSkipp(itog);
        setTitle(local_data.caption);
        const question_keys: { [key: string]: null } = {};
        local_data.Questionary.forEach((item: any) => {
          question_keys[`${item.question}`] = null;
        });

        const keys_ = Object.keys(question_keys);
        console.log(keys_);
        setLocalKeys(keys_);
        setKeys(keys_);
        const itog_data = setInitialData(local_data);

        setItogKeys(Object.keys(itog_data));
        setItog(itog_data);
        setList([]);
      });
    }
  };

  const [showCrumbs, setShowCrumbs] = useState(false);

  const handleReset = () => {
    localStorage.removeItem(questionary_code);
    setRefuse(false);
  };

  const handleCurrentReset = () => {
    setStep(0);
    setData(null);
    localStorage.removeItem("step_" + uuid);
    localStorage.removeItem("itog_" + uuid);
    localStorage.removeItem("uuid");
    localStorage.removeItem(uuid);
    setReset((prev: boolean) => !prev);
  };

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
        setData,
        setList,
        itogKeys,
        questionCode,
        setQuestionCode,
        setKeys,
        direction,
        setDirection,
      }}
    >
      {list.length > 0 ? (
        <CustomList list={list} handleData={handleData} />
      ) : data ? (
        <div className={classes.root}>
          {showHeader && <Header />}
          <Button
            onClick={handleCurrentReset}
            size={"small"}
            className={classes.reset}
            style={{
              textTransform: "lowercase",
              marginLeft: 5,
              marginBottom: 0,
              marginTop: 5,
            }}
          >
            <CancelOutlinedIcon style={{ marginRight: 10 }} /> Отменить
            прохождение
          </Button>

          {!isMobile && (
            <Typography
              variant="h6"
              gutterBottom
              style={{
                padding: 20,
                paddingBottom: 0,
                paddingTop: 10,
                fontSize: 14,
              }}
            >
              {title}
            </Typography>
          )}

          {showCrumbs && <BreadCrumbs len={data.length} setStep={setStep} />}
          <div className={classes.viewer}>
            <Question />
          </div>
          {keys && <Controls setStep={setStep} len={keys.length} />}
        </div>
      ) : (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      )}

      <Dialog
        aria-labelledby="simple-dialog-title"
        open={refuse}
        onClose={() => setRefuse(false)}
      >
        <DialogTitle id="simple-dialog-title">{AGAIN_AND_AGAIN}</DialogTitle>
        <Button
          onClick={handleReset}
          style={{ margin: "auto", marginBottom: 5 }}
        >
          Сбросить
        </Button>
      </Dialog>
    </Context.Provider>
  );
};
