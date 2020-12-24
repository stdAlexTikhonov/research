import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { isMobile } from "../../utils/helpers";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      width: "100%",
      flexDirection: "column",
      justifyContent: "flex-start",
      flexGrow: 1,
      overflow: "auto",
      height: isMobile ? "87vh" : "100vh", //это можно затереть
    },
    viewer: {
      maxWidth: isMobile ? "unset" : 900,
      minWidth: isMobile ? "unset" : 900,
      width: isMobile ? "100%" : "unset",
      flexGrow: 1,
      padding: isMobile ? 10 : "0 20px",
      margin: "auto",
      overflow: "auto",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
    },
    answers: {
      overflow: "auto",
      flexGrow: 1,
      paddingLeft: 20,
    },
  })
);
