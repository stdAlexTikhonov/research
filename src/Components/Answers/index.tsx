import React, { useState } from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Answer } from "../Answer";

type Props = {
  answers: string[];
  id: string;
};

export const Answers: React.FC<Props> = ({ answers, id }) => {
  const [value, setValue] = useState("1");
  const handleChange = (e: any) => setValue(e.target.value);

  return (
    <RadioGroup name={id} value={value} onChange={handleChange}>
      {answers.map((answer: string, index: number) => (
        <Answer title={answer} key={index} value={index} />
      ))}
    </RadioGroup>
  );
};
