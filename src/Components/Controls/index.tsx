import React from "react";
import Button from "@material-ui/core/Button";
import { useStyles } from "./styles";
import { BACK, NEXT } from "../../utils/constants";

export const Controls: React.FC<{ setStep: any; len: number }> = ({
  setStep,
  len,
}) => {
  const classes = useStyles();

  const handleBack = () => {
    setStep((prev: number) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setStep((prev: number) => (prev < len - 1 ? prev + 1 : prev));
  };

  return (
    <div className={classes.root}>
      <div className={classes.constrols}>
        <Button onClick={handleBack} size={"small"}>
          {BACK}
        </Button>

        <Button onClick={handleNext}>{NEXT}</Button>
      </div>
    </div>
  );
};
