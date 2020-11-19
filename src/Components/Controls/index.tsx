import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import { useStyles } from "./styles";
import { BACK, NEXT } from "../../utils/constants";
import { Context } from "../../context";

export const Controls: React.FC<{ setStep: any; len: number }> = ({
  setStep,
  len,
}) => {
  const classes = useStyles();
  const step = useContext(Context);

  const handleBack = () => {
    setStep((prev: number) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setStep((prev: number) => (prev < len - 1 ? prev + 1 : prev));
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
