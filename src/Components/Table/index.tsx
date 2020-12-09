import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { TITLE } from "../../utils/constants";
import { Row } from "../Row";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

type Answer = {
  code: string;
  value: string;
};

type Props = {
  answers: Answer[];
  // variants: string[];
};

export const DenseTable: React.FC<Props> = ({ answers }) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        {/* <TableHead>
          <TableRow>
            <TableCell>{TITLE}</TableCell>
            <TableCell
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {variants.map((variant: string | number) => (
                <div
                  style={{
                    width: variants.length < 10 ? 100 : "unset",
                    textAlign: "center",
                    paddingRight: variants.length > 5 ? 14 : "unset",
                    paddingLeft: variants.length > 5 ? 14 : "unset",
                  }}
                  key={variant}
                >
                  {variant}
                </div>
              ))}
            </TableCell>
          </TableRow>
        </TableHead> */}
        <TableBody>
          {answers.map((answer: Answer, index: number) => (
            <TableRow key={answer.code}>
              <TableCell component="th" scope="row">
                {answer.value}
              </TableCell>
              {/* <TableCell>
                <Row values={variants} row_index={index} />
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
