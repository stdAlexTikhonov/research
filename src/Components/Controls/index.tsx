import React, { useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import { useStyles } from "./styles";
import { BACK, NEXT } from "../../utils/constants";
import { Context } from "../../context";
import { post } from "../../utils/api";

export const Controls: React.FC<{ setStep: any; len: number }> = ({
  setStep,
  len,
}) => {
  const classes = useStyles();
  const context = useContext(Context);
  const { step, itog, uuid, setDir, nextDsb, setNextDsb } = context!;
  const [passed, setPassed] = useState(false);

  const handleBack = () => {
    setStep((prev: number) => (prev > 0 ? prev - 1 : 0));
    setDir(-1);
  };

  const handleNext = () => {
    if (step === len - 1 && !passed) {
      sendToServer({
        respondent: uuid,
        answers: itog,
      });
    }
    // if (!itog[step]) {
    //   setItog((prev: any) => ({
    //     ...prev,
    //     [`${step}`]: null,
    //   }));
    // }

    setStep((prev: number) => (prev < len - 1 ? prev + 1 : prev));
    setDir(1);
    setNextDsb(true);
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

        <Button
          variant="contained"
          color={"primary"}
          onClick={handleNext}
          disabled={(passed && step === 22) || nextDsb}
          className={classes.button}
        >
          {NEXT}
        </Button>
      </div>
    </div>
  );
};
