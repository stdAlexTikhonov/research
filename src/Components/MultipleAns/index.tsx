import React, { useState, useContext, useEffect } from "react";
import FormGroup from "@material-ui/core/FormGroup";
import { CheckboxAns } from "../Answer";

type Props = {
  answers: string[];
  id: string;
};

export const MultipleAns: React.FC<Props> = ({ answers, id }) => {
  return (
    <FormGroup>
      {answers.map((answer: string, index: number) => (
        <CheckboxAns title={answer} key={index} value={index} />
      ))}
    </FormGroup>
  );
};
