import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { isMobile } from "../../utils/helpers";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      minWidth: 80,
      margin: 5,
      minHeight: 27,
    },
    custom: {
      margin: 10,
    },
    constrols: {
      display: "flex",
      justifyContent: "space-around",
      margin: "auto",
      width: isMobile ? "unset" : 300,
      minHeight: 37,
    },
  })
);
