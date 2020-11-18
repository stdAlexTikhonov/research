import React from "react";
import { Radio, FormControlLabel } from "@material-ui/core";

type AnswerType = {
  title: string;
};

export const Answer: React.FC<AnswerType> = ({ title }) => {
  return (
    <FormControlLabel
      value={title}
      control={<Radio color="primary" />}
      label={title}
    />
  );
};
