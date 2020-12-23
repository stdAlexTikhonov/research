import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

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
      // display: "flex",
      // justifyContent: "space-around",
      margin: "auto",
      width: 300,
    },
  })
);
