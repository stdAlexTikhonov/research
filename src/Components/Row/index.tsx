import React, { useState, useContext, useEffect } from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Answer } from "../Answer";
import { useStyles } from "./styles";
import { Context } from "../../context";

type Props = {
  values: string[];
  row_index: number;
};

export const Row: React.FC<Props> = ({ values, row_index }) => {
  const { setItog, step, itog } = useContext(Context)!;
  const [value, setValue] = useState(null);

  useEffect(() => {
    setValue(itog[step] ? itog[step][row_index] : null);
  }, [step]);

  const handleChange = (e: any) => {
    setValue(e.target.value);
    setItog((prev: any) => ({
      ...prev,
      [`${step}`]: {
        ...prev[step],
        [`${row_index}`]: e.target.value,
      },
    }));
  };
  const classes = useStyles();

  return (
    <RadioGroup className={classes.root} value={value} onChange={handleChange}>
      {values.map((value_: string, index: number) => (
        <Answer value={`${index}`} key={value_} user_input={false} />
      ))}
    </RadioGroup>
  );
};
