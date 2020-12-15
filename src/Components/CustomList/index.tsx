import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/Inbox";
import { ListItemProp } from "./types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      height: "100vh",
    },
    root: {
      width: "100%",
      margin: "auto",
      maxWidth: 560,
      maxHeight: 300,
      overflow: "auto",
      backgroundColor: theme.palette.background.paper,
    },
  })
);

export const CustomList: React.FC<{
  list: ListItemProp[];
  handleData: any;
}> = ({ list, handleData }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Paper elevation={3} className={classes.root} variant="outlined">
        <List component="nav" aria-label="main mailbox folders">
          {list.map((item: ListItemProp) => (
            <ListItem
              key={item.code}
              button
              onClick={() => handleData(item.code)}
            >
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={item.caption} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
};
