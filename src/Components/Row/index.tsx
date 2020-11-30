import React, { useState } from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Answer } from "../Answer";
import { useStyles } from "./styles";

type Props = {
  values: string[];
};

export const Row: React.FC<Props> = ({ values }) => {
  const [value, setValue] = useState(null);
  const handleChange = (e: any) => setValue(e.target.value);
  const classes = useStyles();

  return (
    <RadioGroup className={classes.root} value={value} onChange={handleChange}>
      {values.map((value_: string, index: number) => (
        <Answer value={`${index}`} key={value_} />
      ))}
    </RadioGroup>
  );
};
