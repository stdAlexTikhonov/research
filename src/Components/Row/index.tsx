import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  ChangeEvent,
} from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Answer } from "../Answer";
import { useStyles } from "./styles";
import { Context } from "../../context";

type Variant = {
  code: number;
  value: string;
};

type Props = {
  values: Variant[];
  row_index: number;
  setAnswers: any;
};

export const Row: React.FC<Props> = ({ values, row_index, setAnswers }) => {
  const { setItog, step, localKeys, itog } = useContext(Context)!;
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const id = localKeys![step] + "_" + (row_index + 1);
    itog[id] && setValue(itog[id].answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setValue(e.target.value);
      setAnswers((prev: any) => ({
        ...prev,
        [`${row_index}`]: e.target.value,
      }));
      const id = localKeys![step] + "_" + (row_index + 1);

      setItog((prev: any) =>
        Object.assign({}, prev, {
          [`${id}`]: { answers: e.target.value, other: "" },
        })
      );

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [localKeys, row_index, setAnswers, setItog, step]
  );
  const classes = useStyles();

  return (
    <RadioGroup className={classes.root} value={value} onChange={handleChange}>
      {values.map((value_: Variant, index: number) => (
        <Answer
          value={`${value_.code}`}
          key={value_.code}
          user_input={false}
          set_width={values.length < 10}
        />
      ))}
    </RadioGroup>
  );
};
