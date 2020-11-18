import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: window.innerHeight,
      display: "flex",
      width: "100%",
      flexDirection: "column",
      justifyContent: "flex-start",
    },
  })
);
