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
  const { step, itog, uuid, nextDsb, data } = context!;
  const [passed, setPassed] = useState(false);

  const handleBack = () => {
    if (step > 0) setStep((prev: number) => prev - 1);

    localStorage.setItem(`step_${uuid}`, (step - 1).toString());
  };

  const handleNext = () => {
    if (step === len - 1 && !passed) {
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
      localStorage.setItem(`step_${uuid}`, (step + 1).toString());
      localStorage.setItem(`itog_${uuid}`, JSON.stringify(itog));
      setStep((prev: number) => prev + 1);
    }
    // if (!itog[step]) {
    //   setItog((prev: any) => ({
    //     ...prev,
    //     [`${step}`]: null,
    //   }));
    // }
  };

  const sendToServer = async (data: any) => {
    setPassed(true);
    const res = await post("/api/save", data);
    console.log(res);
  };

  return (
    <div className={classes.root}>
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

        {step === len - 1 ? (
          <FinalDialog passed={passed || nextDsb} onClick={handleNext} />
        ) : (
          <Button
            variant="contained"
            color={"primary"}
            onClick={handleNext}
            disabled={nextDsb}
            className={classes.button}
          >
            {NEXT}
          </Button>
        )}
      </div>
    </div>
  );
};
