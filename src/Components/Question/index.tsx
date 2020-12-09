import React, { useContext, useState, useEffect } from "react";
import { Title } from "../Title";
import { Context } from "../../context";
import { Answers } from "../Answers";

export const Question = () => {
  const { step, data, keys } = useContext(Context)!;
  const [key, setKey] = useState<string>("");

  useEffect(() => {
    keys && setKey(keys[step]);
  }, [data, keys, step]);

  return key ? (
    <>
      <Title title={data[key].caption} step={step} />
      <Answers answers={data[key].Reference} user_input={false} />
    </>
  ) : null;
};
