import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem, { ListItemProps } from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import { ListItemProp } from "./types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      margin: "auto",
      maxWidth: 360,
      maxHeight: 300,
      overflow: "auto",
      backgroundColor: theme.palette.background.paper,
    },
  })
);

function ListItemLink(props: ListItemProps<"a", { button?: true }>) {
  return <ListItem button component="a" {...props} />;
}

export const CustomList: React.FC<{
  list: ListItemProp[];
  handleData: any;
}> = ({ list, handleData }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
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
    </div>
  );
};
