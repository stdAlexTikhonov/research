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
  const { setItog, step, keys } = useContext(Context)!;
  const [value, setValue] = useState(null);

  const handleChange = (e: any) => {
    // setItog((prev: any) => ({
    //   ...prev,
    //   [`${step}`]: e.target.value,
    // }));
    setItog((prev: any) =>
      Object.assign({}, prev, {
        [`${keys![step]}`]: { answers: [e.target.value], other: null },
      })
    );

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
          selected={
            value ? +value! === +answers[answers.length - 1].code : false
          }
        />
      ))}
    </RadioGroup>
  );
};
