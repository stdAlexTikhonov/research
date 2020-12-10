import React, { useState, useContext } from "react";
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
  const { setItog, step, keys } = useContext(Context)!;
  // const [userInput, setUserInput] = useState(
  //   () => itog[`user_input_${step}`] || ""
  // );
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
            [`${keys![step]}`]: {
              ...prev[`${keys![step]}`],
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
  const { setItog, step, keys } = useContext(Context)!;
  const [checked_, setChecked] = useState(false);
  const [userInput, setUserInput] = useState("");

  // useEffect(() => {
  //   // setUserInput(itog[step].user_input);
  //   setChecked(itog[step] ? itog[step][value] : false);
  // }, [itog, step, value]);

  const handleChange = (e: React.ChangeEvent<{}>) => {
    console.log(value);
    if (!checked_) {
      console.log("checked");
      setItog((prev: any) => ({
        ...prev,
        [`${keys![step]}`]: Object.assign({}, prev[`${keys![step]}`], {
          answers: prev[`${keys![step]}`].answers.concat([value]),
        }),
      }));
    } else {
      setItog((prev: any) => ({
        ...prev,
        [`${keys![step]}`]: {
          ...prev[`${keys![step]}`],
          answers: prev[`${keys![step]}`].answers.filter(
            (item: string) => item !== value
          ),
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
            [`${keys![step]}`]: {
              ...prev[`${keys![step]}`],
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
