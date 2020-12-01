import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import { CheckboxAns } from "../Answer";

type Props = {
  answers: string[];
  id: string;
  user_input: boolean;
};

export const MultipleAns: React.FC<Props> = ({ answers, id, user_input }) => {
  return (
    <FormGroup>
      {answers.map((answer: string, index: number) => (
        <CheckboxAns
          title={answer}
          key={index}
          value={index}
          user_input={user_input && answers.length - 1 === index}
        />
      ))}
    </FormGroup>
  );
};
