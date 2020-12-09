import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../context";
import { Title } from "../Title";

//   const question_group = group_question[0].question_group;

//   setQuestion(
//     data.References.question_groups.Reference.find(
//       (item: any) => item.code === question_group
//     )
//   );

export const GroupQuestion = () => {
  const { data, step, keys } = useContext(Context)!;
  const [question, setQuestion] = useState<any>();

  useEffect(() => {
    //Групповые вопросы
    const questions = data.Questionary.filter(
      (item: any) => item.question === keys![step]
    );

    const question_group = questions[0].question_group;

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
      <div>Group Question</div>
    </>
  ) : null;
};
