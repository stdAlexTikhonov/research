import React from "react";
import { Typography } from "@material-ui/core";
import { QUESTION } from "../../utils/constants";

type Props = {
  title: string;
  step: number;
};

export const Title: React.FC<Props> = ({ title, step }) => {
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
        {title}
      </Typography>

      {/* {data[step].subtitle && (
        <Typography
          style={{ color: "#aaa" }}
          variant="caption"
          display="block"
          gutterBottom
        >
          {data[step].subtitle}
        </Typography>
      )} */}
    </>
  );
};
