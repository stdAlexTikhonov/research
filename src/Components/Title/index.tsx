import React, { useContext } from "react";
import { Context } from "../../context";
import { Typography } from "@material-ui/core";
import { QUESTION } from "../../utils/constants";

type Props = {
  title: string;
  step: number;
  tooltip?: string;
};

export const Title: React.FC<Props> = ({ title, step, tooltip }) => {
  const { keys, localKeys } = useContext(Context)!;
  const local_step = keys!.indexOf(localKeys[step]);

  return (
    <>
      <Typography
        style={{ color: "#aaa" }}
        variant="overline"
        display="block"
        gutterBottom
      >
        {`${QUESTION} ${local_step > -1 ? local_step + 1 : step + 1}`}
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
