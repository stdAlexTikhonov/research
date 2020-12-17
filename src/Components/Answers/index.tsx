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
  shouldSkip: any;
};

export const Answers: React.FC<Props> = ({
  answers,
  user_input,
  shouldSkip,
}) => {
  const { setItog, step, keys, itog, setNextDsb, shouldSkipp } = useContext(
    Context
  )!;
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const id = keys![step];
    itog[id] && setValue(itog[id].answers);
    // console.log(shouldSkip());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleChange = (e: any) => {
    setItog((prev: any) =>
      Object.assign({}, prev, {
        [`${keys![step]}`]: { answers: e.target.value, other: "" },
      })
    );

    setValue(e.target.value);
    setNextDsb(false);
    let copy = keys?.slice();
    const key = keys![step];
    const arr = shouldSkipp[key];

    if (shouldSkip(e.target.value) !== undefined)
      if (shouldSkip(e.target.value))
        copy = copy?.filter((item: string) => !arr.includes(item));
      else if (copy?.indexOf(arr[0]) === -1) copy?.splice(step, 0, ...arr);
    console.log(copy);
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
