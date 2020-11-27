import React, { useState, useContext } from "react";
import { Radio, FormControlLabel, Checkbox } from "@material-ui/core";
import { Context } from "../../context";

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
  const { setItog, step } = useContext(Context)!;
  // const { setItog, step } = my_context!;
  const [checked, setChecked] = useState(false);
  return (
    <FormControlLabel
      control={
        <Checkbox
          color="primary"
          checked={checked}
          name={value.toString()}
          onChange={(e) => {
            if (e.target.checked) {
              setItog((prev: any) => ({
                ...prev,
                [`${step}`]: prev[step]
                  ? prev[step] + e.target.name + ","
                  : e.target.name + ",",
              }));
            } else {
              setItog((prev: any) => ({
                ...prev,
                [`${step}`]: prev[step].split(e.target.name + ",").join(""),
              }));
            }
            setChecked(!checked);
          }}
        />
      }
      label={title}
    />
  );
};
