import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import { CheckboxAns } from "../Answer";

type Answer = {
  code: string;
  value: string;
};

type Props = {
  answers: Answer[];
  user_input: boolean;
};

export const MultipleAns: React.FC<Props> = ({ answers, user_input }) => {
  return (
    <FormGroup style={{ paddingLeft: 15 }}>
      {answers.map((answer: Answer, index: number) => (
        <CheckboxAns
          title={answer.value}
          key={answer.code}
          value={answer.code}
          user_input={user_input && answers.length - 1 === index}
        />
      ))}
    </FormGroup>
  );
};
