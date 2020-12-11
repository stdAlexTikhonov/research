import React from "react";
import { Typography } from "@material-ui/core";
import { QUESTION } from "../../utils/constants";

type Props = {
  title: string;
  step: number;
  tooltip?: string;
};

export const Title: React.FC<Props> = ({ title, step, tooltip }) => {
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

      {tooltip && (
        <Typography
          style={{ color: "#aaa" }}
          variant="caption"
          display="block"
          gutterBottom
        >
          {tooltip}
        </Typography>
      )}
    </>
  );
};
