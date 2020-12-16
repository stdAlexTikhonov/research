import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../context";
import { DenseTable } from "../Table";

//   const question_group = group_question[0].question_group;

//   setQuestion(
//     data.References.question_groups.Reference.find(
//       (item: any) => item.code === question_group
//     )
//   );

export const GroupQuestion = () => {
  const { data, step, keys, itog, setNextDsb } = useContext(Context)!;

  const [questions, setQuestions] = useState<any>();

  useEffect(() => {
    //Групповые вопросы

    const q = localStorage.getItem(`${keys![step]}`);

    if (q) {
      const questions_ = JSON.parse(q);
      const transformed = questions_.map((question: any, index: number) => ({
        ...question,
        should_show: question.condition
          ? +question.condition === +itog[question.parent_code].answers ||
            +question.condition === -1
          : true,
      }));

      const disable = transformed.some((item: any) => !itog[item.code].answers);
      setNextDsb(disable);
      setQuestions(transformed);
    } else {
      const questions_ = data.Questionary.filter(
        (item: any) => item.question === keys![step]
      );

      const transformed = questions_.map((question: any, index: number) => ({
        ...question,
        should_show:
          !question.condition ||
          +question.condition === +itog[question.parent_code].answers,
      }));

      setQuestions(transformed);
      // const question_group = questions_[0].question_group;

      // const question_data = data.References.question_groups.Reference.find(
      //   (item: any) => item.code === question_group
      // );
      // setQuestion(question_data);
      const disable = transformed.some((item: any) => !itog[item.code].answers);
      setNextDsb(disable);
      // localStorage.setItem(`${keys![step]}`, JSON.stringify(questions_));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return questions ? (
    <>
      <DenseTable
        answers={questions}
        variants={data.References[keys![step]].Reference}
      />
    </>
  ) : null;
};
