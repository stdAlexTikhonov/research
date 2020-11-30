import React, { useState, useContext, useEffect } from "react";
import { Radio, FormControlLabel, Checkbox } from "@material-ui/core";
import { Context } from "../../context";
import TextField from "@material-ui/core/TextField";

type AnswerType = {
  title?: string;
  value: string | number;
  user_input: boolean;
  selected?: boolean;
};

export const Answer: React.FC<AnswerType> = ({
  title,
  value,
  user_input,
  selected,
}) => {
  const { setItog, step } = useContext(Context)!;
  const [userInput, setUserInput] = useState("");
  return user_input ? (
    <div style={{ display: "flex", width: "100%", flexWrap: "wrap" }}>
      <FormControlLabel
        value={value.toString()}
        control={<Radio color="primary" size={"small"} />}
        label={title}
        style={{ margin: 0 }}
      />
      <TextField
        id="standard-basic"
        value={userInput}
        disabled={!selected}
        onChange={(e) => {
          setUserInput(e.target.value);
          setItog((prev: any) => ({
            ...prev,
            [`${step}`]: {
              [`${value}`]: e.target.value,
            },
          }));
        }}
        style={{ minWidth: 300, marginLeft: 20 }}
      />
    </div>
  ) : (
    <FormControlLabel
      value={value.toString()}
      control={<Radio color="primary" size={"small"} />}
      label={title}
      style={{ margin: 0 }}
    />
  );
};

export const CheckboxAns: React.FC<AnswerType> = ({
  title,
  value,
  user_input,
}) => {
  const { setItog, step, itog } = useContext(Context)!;
  const [checked_, setChecked] = useState(false);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    // setUserInput(itog[step].user_input);
    setChecked(itog[step] ? itog[step][value] : false);
  }, [step]);

  const handleChange = (e: React.ChangeEvent<{}>) => {
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
  };

  return user_input ? (
    <div style={{ display: "flex", width: "100%", flexWrap: "wrap" }}>
      <FormControlLabel
        checked={checked_}
        onChange={handleChange}
        control={<Checkbox color="primary" />}
        label={title}
      />
      <TextField
        id="standard-basic"
        value={userInput}
        disabled={!checked_}
        onChange={(e) => {
          setUserInput(e.target.value);
          setItog((prev: any) => ({
            ...prev,
            [`${step}`]: {
              ...prev[step],
              [`${value}`]: e.target.value,
            },
          }));
        }}
        style={{ minWidth: 300, marginLeft: 20 }}
      />
    </div>
  ) : (
    <FormControlLabel
      checked={checked_}
      onChange={handleChange}
      control={<Checkbox color="primary" />}
      label={title}
    />
  );
};
