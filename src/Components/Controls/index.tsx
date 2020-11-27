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
  const { step, itog } = context ? context : { step: 0, itog: null };
  const [passed, setPassed] = useState(false);

  const handleBack = () => {
    setStep((prev: number) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    if (step === len - 2 && !passed) {
      console.log(itog);
      // sendToServer();
    }
    setStep((prev: number) => (prev < len - 1 ? prev + 1 : prev));
  };

  const sendToServer = async () => {
    setPassed(true);
    const res = await post("/", itog);
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
          disabled={step === len - 1}
          className={classes.button}
        >
          {NEXT}
        </Button>
      </div>
    </div>
  );
};
