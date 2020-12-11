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
  const { step, data, keys, itog, setStep } = useContext(Context)!;
  const [question, setQuestion] = useState<any>("");
  const [answers, setAnswers] = useState<Answer[]>();
  const [group_question, setGQ] = useState(false);

  const shouldSkip = (data: any) =>
    data.parent_code && +itog[data.parent_code].answers === +data.condition;

  useEffect(() => {
    if (keys) {
      const question_data = data.Questionary.find(
        (item: any) => item.code === keys[step]
      );

      if (question_data) {
        shouldSkip(question_data) && setStep((prev: number) => prev + 1);
        setGQ(false);
        setQuestion(question_data);

        const key = keys[step];

        if (question_data.other_allowed)
          setAnswers(
            data.References[key].Reference.concat([
              {
                code: data.References[key].Reference.length + 1,
                value: question_data.other_text,
              },
            ])
          );
        else setAnswers(data.References[key].Reference);
      } else {
        const qg_data = localStorage.getItem(`${keys[step]}_group`);

        if (qg_data) setQuestion(JSON.parse(qg_data));
        else {
          const question_data = data.Questionary.find(
            (item: any) => item.code === keys[step] + "_1"
          );

          const question_group_data = data.References.question_groups.Reference.find(
            (item: any) => item.code === question_data.question_group
          );

          question_data.title = question_group_data.value;

          setQuestion(question_data);
          localStorage.setItem(
            `${keys[step]}_group`,
            JSON.stringify(question_data)
          );
        }

        setGQ(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, step]);

  return question && answers ? (
    <>
      <Title
        title={group_question ? question.title : question.value}
        step={step}
      />
      <div style={{ width: "100%", overflow: "auto" }}>
        {group_question ? (
          <GroupQuestion />
        ) : question.multiple_values ? (
          <MultipleAns answers={answers} user_input={question.other_allowed} />
        ) : (
          <Answers answers={answers} user_input={question.other_allowed} />
        )}
      </div>
    </>
  ) : null;
};
