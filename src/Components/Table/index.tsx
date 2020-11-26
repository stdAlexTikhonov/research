import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { TITLE } from "../../utils/constants";
import { Answer } from "../Answer";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

type Props = {
  answers: string[];
  variants: string[];
};

export const DenseTable: React.FC<Props> = ({ answers, variants }) => {
  const classes = useStyles();

  const rows = useMemo(
    () =>
      answers.map((answer: string) => createData(answer, 159, 6.0, 24, 4.0)),
    [answers]
  );

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>{TITLE}</TableCell>
            {variants.map((variant: string | number) => (
              <TableCell
                key={variant}
                style={{
                  padding: 0,
                  margin: 0,
                  maxWidth: 130,
                  textAlign: variants.length < 10 ? "center" : "left",
                }}
              >
                {variant}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              {variants.map((variant: string | number) => (
                <TableCell
                  key={variant}
                  style={{
                    padding: 0,
                    margin: 0,
                    textAlign: variants.length < 10 ? "center" : "left",
                  }}
                >
                  <Answer value={variant} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
