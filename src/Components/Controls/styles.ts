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
      fontSize: 20,
      maxWidth: 30,
      maxHeight: 30,
      minWidth: "unset",
      "& > .MuiButton-label .MuiButton-startIcon.MuiButton-iconSizeMedium": {
        marginLeft: 0,
        marginRight: 0,
      },
      margin: 5,
    },
    custom: {
      margin: 10,
    },
    constrols: {
      display: "flex",
      justifyContent: "space-around",
      margin: "auto",
    },
  })
);
