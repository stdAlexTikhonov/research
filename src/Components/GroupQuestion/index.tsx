import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../context";
import { Title } from "../Title";
import { DenseTable } from "../Table";

//   const question_group = group_question[0].question_group;

//   setQuestion(
//     data.References.question_groups.Reference.find(
//       (item: any) => item.code === question_group
//     )
//   );

export const GroupQuestion = () => {
  const { data, step, keys } = useContext(Context)!;
  const [question, setQuestion] = useState<any>();
  const [questions, setQuestions] = useState<any>();

  useEffect(() => {
    //Групповые вопросы
    const questions_ = data.Questionary.filter(
      (item: any) => item.question === keys![step]
    );

    setQuestions(questions_);

    const question_group = questions_[0].question_group;

    setQuestion(
      data.References.question_groups.Reference.find(
        (item: any) => item.code === question_group
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
  return question ? (
    <>
      <Title title={question.value} step={step} />
      <DenseTable answers={questions} />
    </>
  ) : null;
};
