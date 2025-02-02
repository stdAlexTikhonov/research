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
  const {
    data,
    step,
    keys,
    itog,
    setNextDsb,
    localKeys,
    setStep,
    direction,
  } = useContext(Context)!;

  const [questions, setQuestions] = useState<any>();

  useEffect(() => {
    //Групповые вопросы

    const questions_ = data.Questionary.filter(
      (item: any) => item.question === localKeys![step]
    );

    const transformed = questions_.map((question: any, index: number) => ({
      ...question,
      should_show:
        !question.condition ||
        +question.condition === +itog[question.parent_code].answers,
    }));

    setQuestions(transformed);
    if (transformed.every((item: any) => !item.should_show))
      setStep((prev: number) => prev + direction);
    // const question_group = questions_[0].question_group;

    // const question_data = data.References.question_groups.Reference.find(
    //   (item: any) => item.code === question_group
    // );
    // setQuestion(question_data);
    const disable = transformed
      .filter((item: any) => item.should_show)
      .some((item: any) => !itog[item.code].answers);
    setNextDsb(disable);

    // localStorage.setItem(`${keys![step]}`, JSON.stringify(questions_));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return questions ? (
    <>
      <DenseTable
        answers={questions}
        variants={data.References[localKeys![step]].Reference}
      />
    </>
  ) : null;
};
