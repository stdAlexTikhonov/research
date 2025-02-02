import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  ChangeEvent,
} from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Answer } from "../Answer";
import { Context } from "../../context";

type Answer = {
  code: string;
  value: string;
};

type Props = {
  answers: Answer[];
  user_input: boolean;
  shouldSkip: any;
};

export const Answers: React.FC<Props> = ({
  answers,
  user_input,
  shouldSkip,
}) => {
  const {
    setItog,
    step,
    keys,
    localKeys,
    itog,
    setNextDsb,
    shouldSkipp,
    setLocalKeys,
    questionCode,
  } = useContext(Context)!;
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const id = localKeys![step];
    itog && itog[id] && setValue(itog[id].answers);

    // console.log(shouldSkip());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const { value } = event.currentTarget;

      setItog((prev: any) =>
        Object.assign({}, prev, {
          [`${questionCode}`]: { answers: value, other: "" },
        })
      );

      setValue(value);
      setNextDsb(false);
      let copy = keys?.slice();
      const key = localKeys![step];
      const arr = shouldSkipp[key];

      if (shouldSkip(value) !== undefined && arr) {
        if (shouldSkip(value))
          copy = copy?.filter((item: string) => !arr.includes(item));
        else if (copy?.indexOf(arr[0]) === -1) copy?.splice(step, 0, ...arr);

        copy && setLocalKeys(copy);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questionCode]
  );

  return (
    <RadioGroup
      name={keys ? keys[step] : "name"}
      value={value}
      onChange={handleChange}
    >
      {answers.map((answer: Answer, index: number) => (
        <Answer
          title={answer.value}
          key={index}
          value={answer.code}
          user_input={user_input && answers.length - 1 === index}
          selected={
            value ? +value! === +answers[answers.length - 1].code : false
          }
        />
      ))}
    </RadioGroup>
  );
};
