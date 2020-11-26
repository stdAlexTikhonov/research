import React from "react";
import { Radio, FormControlLabel } from "@material-ui/core";

type AnswerType = {
  title?: string;
  value: string | number;
};

export const Answer: React.FC<AnswerType> = ({ title, value }) => {
  return (
    <FormControlLabel
      value={value.toString()}
      control={<Radio color="primary" size={"small"} />}
      label={title}
    />
  );
};
