import React, { useContext } from "react";
import { Context } from "../../context";
import { Typography } from "@material-ui/core";
import { QUESTION } from "../../utils/constants";

export const Title = () => {
  const context = useContext(Context);
  const { step, data } = context ? context : { step: 0, data: null };

  return (
    <>
      <Typography
        style={{ color: "#aaa" }}
        variant="overline"
        display="block"
        gutterBottom
      >
        {`${QUESTION} ${step + 1}`}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {data[step].question}
      </Typography>
      {data[step].subtitle && (
        <Typography
          style={{ color: "#aaa" }}
          variant="caption"
          display="block"
          gutterBottom
        >
          {data[step].subtitle}
        </Typography>
      )}
    </>
  );
};
