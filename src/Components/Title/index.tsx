import React, { useContext } from "react";
import { Context } from "../../context";
import { Typography } from "@material-ui/core";
import { QUESTION } from "../../utils/constants";

export const Title = () => {
  const { step, data, keys } = useContext(Context)!;

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
      {data && (
        <Typography variant="h6" gutterBottom>
          {keys && data[keys[step]].caption}
        </Typography>
      )}
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
