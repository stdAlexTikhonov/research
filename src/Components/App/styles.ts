import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      width: "100%",
      flexDirection: "column",
      justifyContent: "flex-start",
      height: "100vh",
    },
    viewer: {
      padding: 20,
      maxWidth: 900,
      minWidth: 900,
      flexGrow: 1,
      margin: "auto",
      overflow: "auto",
      display: "flex",
      flexDirection: "column",
    },
    answers: {
      overflow: "auto",
      flexGrow: 1,
      paddingLeft: 20,
    },
  })
);
