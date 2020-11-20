import React, { useContext, useMemo } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import { useStyles } from "./styles";
import { Context } from "../../context";

export const BreadCrumbs: React.FC<{ len: number; setStep: any }> = ({
  len,
  setStep,
}) => {
  const context = useContext(Context);
  const { step } = context ? context : { step: 0 };
  const breadcrumbs = useMemo(
    () =>
      Array(len)
        .fill("Вопрос")
        .map((item, i) => item + (i + 1)),
    [len]
  );

  const sliced = breadcrumbs.slice(0, step);

  const handleChange = (step: number) => setStep(step);

  const classes = useStyles();
  return (
    <div style={{ display: "flex" }}>
      <Breadcrumbs
        separator="›"
        aria-label="breadcrumb"
        className={classes.root}
      >
        {sliced.map((item, i) => (
          <Button
            key={i}
            color="inherit"
            className={classes.link}
            onClick={() => handleChange(i)}
          >
            {item}
          </Button>
        ))}
        <Button disabled={true} style={{ color: "black" }}>
          {breadcrumbs[step]}
        </Button>
      </Breadcrumbs>
    </div>
  );
};
