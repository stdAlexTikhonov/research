import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { useStyles } from "./styles";
import { NAME } from "../../utils/constants";
import image from "./logo-color.png";

export const Header = () => {
  const classes = useStyles();

  return (
    <>
      <AppBar position="static" className={classes.root} color={"primary"}>
        <Toolbar>
          <Avatar variant="square" className={classes.square} src={image} />
          <Typography variant="h6" className={classes.title}>
            {NAME}
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};
