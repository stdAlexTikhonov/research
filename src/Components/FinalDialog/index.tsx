import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { blue } from "@material-ui/core/colors";
import { NEXT, FINAL_TITLE } from "../../utils/constants";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  button: {
    minWidth: 80,
    margin: 5,
  },
});

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open } = props;

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">{FINAL_TITLE}</DialogTitle>
    </Dialog>
  );
}

export const FinalDialog: React.FC<{ passed: boolean; onClick: any }> = ({
  passed,
  onClick,
}) => {
  const [open, setOpen] = React.useState(false);

  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
    onClick();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        className={classes.button}
        disabled={passed}
      >
        {NEXT}
      </Button>
      <SimpleDialog open={open} onClose={handleClose} />
    </>
  );
};
