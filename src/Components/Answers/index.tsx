import React, { useState, useContext } from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Answer } from "../Answer";
import { Context } from "../../context";

type Props = {
  answers: string[];
  id: string;
};

export const Answers: React.FC<Props> = ({ answers, id }) => {
  const [value, setValue] = useState("1");
  const my_context = useContext(Context);

  const handleChange = (e: any) => {
    if (my_context) {
      const { setItog, step } = my_context;
      setItog((prev: any) => ({
        ...prev,
        [`${step}`]: e.target.value,
      }));
    }
    setValue(e.target.value);
  };

  return (
    <RadioGroup name={id} value={value} onChange={handleChange}>
      {answers.map((answer: string, index: number) => (
        <Answer title={answer} key={index} value={index} />
      ))}
    </RadioGroup>
  );
};
