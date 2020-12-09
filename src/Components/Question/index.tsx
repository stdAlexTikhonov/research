import React, { useContext, useState, useEffect } from "react";
import { Title } from "../Title";
import { Context } from "../../context";
import { Answers } from "../Answers";

type Answer = {
  code: string;
  value: string;
};

export const Question = () => {
  const { step, data, keys } = useContext(Context)!;
  const [question, setQuestion] = useState<any>("");
  const [answers, setAnswers] = useState<Answer[]>();

  useEffect(() => {
    if (keys) {
      const question_data = data.Questionary.find(
        (item: any) => item.code === keys[step]
      );
      setQuestion(question_data);
      console.log(question_data);
      const key = keys[step];

      setAnswers(data.References[key].Reference);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, step]);

  return question && answers ? (
    <>
      <Title title={question.value} step={step} />
      <Answers answers={answers} user_input={question.other_allowed} />
    </>
  ) : null;
};
