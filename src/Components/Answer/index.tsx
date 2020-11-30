import React, { useState, useContext, useEffect } from "react";
import { Radio, FormControlLabel, Checkbox } from "@material-ui/core";
import { Context } from "../../context";
import TextField from "@material-ui/core/TextField";

type AnswerType = {
  title?: string;
  value: string | number;
  user_input: boolean;
};

type CheckboxType = AnswerType & { checked: boolean };

export const Answer: React.FC<AnswerType> = ({ title, value, user_input }) => {
  return (
    <div style={{ display: "flex", width: "100%", flexWrap: "wrap" }}>
      <FormControlLabel
        value={value.toString()}
        control={<Radio color="primary" size={"small"} />}
        label={title}
        style={{ margin: 0 }}
      />
      {user_input && (
        <TextField id="standard-basic" style={{ minWidth: 300 }} />
      )}
    </div>
  );
};

export const CheckboxAns: React.FC<AnswerType> = ({
  title,
  value,
  user_input,
}) => {
  const { setItog, step, itog } = useContext(Context)!;
  const [checked_, setChecked] = useState(false);

  useEffect(() => {
    // setUserInput(itog[step].user_input);
    setChecked(itog[step] ? itog[step][value] : false);
  }, [step]);

  return (
    <div style={{ display: "flex", width: "100%", flexWrap: "wrap" }}>
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
      {user_input && (
        <TextField id="standard-basic" style={{ minWidth: 300 }} />
      )}
    </div>
  );
};
