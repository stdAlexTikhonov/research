import React, { useState, useContext, useEffect } from "react";
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
};

export const Row: React.FC<Props> = ({ values, row_index }) => {
  const { setItog, step, keys, itog, setNextDsb } = useContext(Context)!;
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const id = keys![step] + "_" + (row_index + 1);
    itog[id] && setValue(itog[id].answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleChange = (e: any) => {
    setValue(e.target.value);
    const id = keys![step] + "_" + (row_index + 1);

    const timeout = setTimeout(function () {
      setItog((prev: any) =>
        Object.assign({}, prev, {
          [`${id}`]: { answers: e.target.value, other: "" },
        })
      );
      clearTimeout(timeout);
    }, 0);
    setNextDsb(false);
  };
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
