import React, { useState, useContext, useEffect } from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Answer } from "../Answer";
import { Context } from "../../context";

type Answer = {
  code: string;
  value: string;
};

type Props = {
  answers: Answer[];
  user_input: boolean;
};

export const Answers: React.FC<Props> = ({ answers, user_input }) => {
  const { setItog, step, itog, keys } = useContext(Context)!;
  const [value, setValue] = useState(null);

  // useEffect(() => {
  //   itog[step] ? setValue(itog[step]) : setValue(null);
  // }, [step]);

  const handleChange = (e: any) => {
    // setItog((prev: any) => ({
    //   ...prev,
    //   [`${step}`]: e.target.value,
    // }));

    setValue(e.target.value);
  };

  return (
    <RadioGroup
      name={keys ? keys[step] : "name"}
      value={value}
      onChange={handleChange}
    >
      {answers.map((answer: Answer, index: number) => (
        <Answer
          title={answer.value}
          key={index}
          value={answer.code}
          user_input={user_input && answers.length - 1 === index}
          selected={index == value}
        />
      ))}
    </RadioGroup>
  );
};
