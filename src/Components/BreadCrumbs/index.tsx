import React, { useContext, useMemo } from "react";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { useStyles } from "./styles";
import { Context } from "../../context";
// import { Navigation } from "../Navigation";

export const BreadCrumbs: React.FC<{ len: number; setStep: any }> = ({
  len,
  setStep,
}) => {
  const step = useContext(Context);
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
      <Breadcrumbs aria-label="breadcrumb" className={classes.root}>
        {sliced.map((item, i) => (
          <Link
            key={i}
            color="inherit"
            className={classes.link}
            onClick={() => handleChange(i)}
          >
            {item}
          </Link>
        ))}
        <Typography color="textPrimary">{breadcrumbs[step]}</Typography>
      </Breadcrumbs>
    </div>
  );
};
