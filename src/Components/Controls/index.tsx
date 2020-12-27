import React, { useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import { useStyles } from "./styles";
import { BACK, NEXT } from "../../utils/constants";
import { Context } from "../../context";
import { post } from "../../utils/api";
import { FinalDialog } from "../FinalDialog";

export const Controls: React.FC<{ setStep: any; len: number }> = ({
  setStep,
  len,
}) => {
  const classes = useStyles();
  const context = useContext(Context);
  const {
    step,
    itog,
    uuid,
    nextDsb,
    data,
    localKeys,
    keys,
    setData,
    setKeys,
    setItog,
    setLocalKeys,
    setQuestionCode,
  } = context!;
  //   const [step, setStep] = useState<number>(0);
  // const [data, setData] = useState<any>(null);
  // const [keys, setKeys] = useState<any>(null);
  // const [uuid, setUuid] = useState<string>("");
  // const [title, setTitle] = useState<string>("");
  // const [list, setList] = useState<ListItemProp[]>([]);
  // const [shouldSkipp, setShouldSkipp] = useState<any>(null);
  // const [skipped, setSkipped] = useState<string[]>([]);
  // const [nextDsb, setNextDsb] = useState<boolean>(true);
  // const [refuse, setRefuse] = useState(false);
  // const [itog, setItog] = useState();
  // const [localKeys, setLocalKeys] = useState<any>(null);
  // const [itogKeys, setItogKeys] = useState<string[] | null>(null);
  // const [questionCode, setQuestionCode] = useState<string>("");
  const [passed, setPassed] = useState(false);

  const handleBack = () => {
    if (step > 0) setStep((prev: number) => prev - 1);
    const key = localKeys[step - 1];
    localStorage.setItem(`step_${uuid}`, keys!.indexOf(key).toString());
  };

  const handleNext = () => {
    if (step === localKeys.length - 1 && !passed) {
      sendToServer({
        respondent: uuid,
        answers: itog,
      });
      localStorage.removeItem("step_" + uuid);
      localStorage.removeItem("itog_" + uuid);
      localStorage.removeItem("uuid");
      localStorage.removeItem(uuid);
      localStorage.setItem(data.code, new Date().getFullYear().toString());
    } else {
      const key = localKeys[step < localKeys.length - 1 ? step + 1 : step];
      localStorage.setItem(`step_${uuid}`, keys!.indexOf(key).toString());
      localStorage.setItem(`itog_${uuid}`, JSON.stringify(itog));
      setStep((prev: number) =>
        prev < localKeys.length - 1 ? prev + 1 : prev
      );
    }
  };

  const sendToServer = async (form: any) => {
    setPassed(true);
    form.survey = data.code;
    console.log("sendToServer", form);
    const res = await post("/api/save", form);
    console.log("sendToServer", res);
  };

  return (
    <div className={classes.constrols}>
      <Button
        variant="contained"
        color={"primary"}
        onClick={handleBack}
        size={"small"}
        disabled={step === 0}
        className={classes.button}
      >
        {BACK}
      </Button>

      {step === localKeys.length - 1 ? (
        <FinalDialog passed={passed || nextDsb} onClick={handleNext} />
      ) : (
        <Button
          variant="contained"
          color={"primary"}
          size={"small"}
          onClick={handleNext}
          disabled={nextDsb}
          className={classes.button}
        >
          {NEXT}
        </Button>
      )}
    </div>
  );
};
