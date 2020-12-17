import React, { useState, useContext, useEffect } from "react";
import { Radio, FormControlLabel, Checkbox } from "@material-ui/core";
import { Context } from "../../context";
import TextField from "@material-ui/core/TextField";

type AnswerType = {
  title?: string;
  value: string | number;
  user_input: boolean;
  selected?: boolean;
  set_width?: boolean;
};

export const Answer: React.FC<AnswerType> = ({
  title,
  value,
  user_input,
  selected,
  set_width,
}) => {
  const { setItog, step, localKeys, itog } = useContext(Context)!;

  useEffect(() => {
    const id = localKeys![step];

    itog[id] && setUserInput(itog[id].other);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

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
            [`${localKeys![step]}`]: {
              ...prev[`${localKeys![step]}`],
              other: e.target.value,
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
      style={{
        margin: 0,
        minWidth: set_width ? 100 : "unset",
        display: set_width ? "flex" : "unset",
        justifyContent: "center",
      }}
    />
  );
};

export const CheckboxAns: React.FC<AnswerType> = ({
  title,
  value,
  user_input,
}) => {
  const { setItog, step, localKeys, itog, setNextDsb } = useContext(Context)!;
  const [checked_, setChecked] = useState(false);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const id = localKeys![step];
    itog[id] &&
      itog[id].answers &&
      setChecked(itog[id].answers.includes(value));
    itog[id] && setUserInput(itog[id].other);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleChange = (e: React.ChangeEvent<{}>) => {
    if (!checked_) {
      const new_answers = itog[`${localKeys![step]}`].answers.concat([value]);
      const filtered = new_answers.filter((item: any) => item !== null);
      setNextDsb(filtered.length === 0);
      setItog((prev: any) => ({
        ...prev,
        [`${localKeys![step]}`]: Object.assign(
          {},
          prev[`${localKeys![step]}`],
          {
            answers: filtered,
          }
        ),
      }));
    } else {
      const filtered = itog[`${localKeys![step]}`].answers.filter(
        (item: string) => item !== value
      );
      setNextDsb(filtered.length === 0);
      setItog((prev: any) => ({
        ...prev,
        [`${localKeys![step]}`]: {
          ...prev[`${localKeys![step]}`],
          answers: filtered,
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
            [`${localKeys![step]}`]: {
              ...prev[`${localKeys![step]}`],
              other: e.target.value,
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
