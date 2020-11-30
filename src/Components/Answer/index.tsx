import React, { useState, useContext, useEffect } from "react";
import { Radio, FormControlLabel, Checkbox } from "@material-ui/core";
import { Context } from "../../context";

type AnswerType = {
  title?: string;
  value: string | number;
};

type CheckboxType = AnswerType & { checked: boolean };

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
  const [checked_, setChecked] = useState(false);

  useEffect(() => {
    setChecked(itog[step] ? itog[step][value] : false);
  }, [step]);

  return (
    <FormControlLabel
      checked={checked_}
      onChange={(e) => {
        if (!checked_) {
          setItog((prev: any) => ({
            ...prev,
            [`${step}`]: !!prev[step]
              ? {
                  ...prev[step],
                  [`${value}`]: true,
                }
              : {
                  [`${value}`]: true,
                },
          }));
        } else {
          setItog((prev: any) => ({
            ...prev,
            [`${step}`]: {
              ...prev[step],
              [`${value}`]: false,
            },
          }));
        }
        setChecked(!checked_);
      }}
      control={<Checkbox color="primary" />}
      label={title}
    />
  );
};
