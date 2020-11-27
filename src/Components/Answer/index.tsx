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
  const { setItog, step, itog } = useContext(Context)!;

  const [checked, setChecked] = useState(() =>
    itog[step] ? itog[step][`${value}`] : false
  );
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
                [`${step}`]: !!prev[step]
                  ? {
                      ...prev[step],
                      [`${e.target.name}`]: true,
                    }
                  : {
                      [`${e.target.name}`]: true,
                    },
              }));
            } else {
              setItog((prev: any) => ({
                ...prev,
                [`${step}`]: {
                  ...prev[step],
                  [`${e.target.name}`]: false,
                },
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
