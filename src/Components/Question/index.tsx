import React, { useContext, useState, useEffect } from "react";
import { Title } from "../Title";
import { Context } from "../../context";
import { Answers } from "../Answers";
import { MultipleAns } from "../MultipleAns";
import { GroupQuestion } from "../GroupQuestion";

type Answer = {
  code: string;
  value: string;
};

export const Question = () => {
  const { step, data, keys } = useContext(Context)!;
  const [question, setQuestion] = useState<any>("");
  const [answers, setAnswers] = useState<Answer[]>();
  const [group_question, setGQ] = useState(false);

  useEffect(() => {
    if (keys) {
      const question_data = data.Questionary.find(
        (item: any) => item.code === keys[step]
      );

      if (question_data) {
        console.log(question_data);
        setGQ(false);
        setQuestion(question_data);
        // console.log(question_data);

        const key = keys[step];
        const new_code = data.References[key].Reference.length;
        if (question_data.other_allowed)
          setAnswers(
            data.References[key].Reference.concat([
              {
                code: question_data.multiple_values ? new_code + 1 : new_code,
                value: question_data.other_text,
              },
            ])
          );
        else setAnswers(data.References[key].Reference);
      } else setGQ(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, step]);

  return group_question ? (
    <GroupQuestion />
  ) : question && answers ? (
    <>
      <Title title={question.value} step={step} />
      {question.multiple_values ? (
        <MultipleAns answers={answers} user_input={question.other_allowed} />
      ) : (
        <Answers answers={answers} user_input={question.other_allowed} />
      )}
    </>
  ) : null;
};
