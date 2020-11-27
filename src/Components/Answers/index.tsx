import React, { useState, useContext, useEffect } from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Answer } from "../Answer";
import { Context } from "../../context";

type Props = {
  answers: string[];
  id: string;
};

export const Answers: React.FC<Props> = ({ answers, id }) => {
  const { setItog, step, itog } = useContext(Context)!;
  const [value, setValue] = useState(null);

  useEffect(() => {
    itog[step] ? setValue(itog[step]) : setValue(null);
  }, [step]);

  const handleChange = (e: any) => {
    setItog((prev: any) => ({
      ...prev,
      [`${step}`]: e.target.value,
    }));

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
