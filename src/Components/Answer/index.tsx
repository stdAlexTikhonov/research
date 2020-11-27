import React, { useState } from "react";
import { Radio, FormControlLabel, Checkbox } from "@material-ui/core";

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
      style={{ margin: 0 }}
    />
  );
};

export const CheckboxAns: React.FC<AnswerType> = ({ title, value }) => {
  const [checked, setChecked] = useState(false);
  return (
    <FormControlLabel
      control={
        <Checkbox
          color="primary"
          checked={checked}
          name={value.toString()}
          onChange={() => setChecked(!checked)}
        />
      }
      label={title}
    />
  );
};
