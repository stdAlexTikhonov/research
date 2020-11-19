import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { deepOrange } from "@material-ui/core/colors";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // color: "#444",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      fontSize: 14,
      marginRight: "auto",
    },
    block: {
      flexGrow: 1,
      marginLeft: 50,
      display: "flex",
      flexDirection: "column",
    },
    square: {
      color: theme.palette.getContrastText(deepOrange[500]),
      marginLeft: 25,
      marginRight: 25,
    },
    typo: {
      fontWeight: "bold",
      fontSize: 14,
      "& span": {
        fontWeight: "normal",
      },
    },
  })
);
