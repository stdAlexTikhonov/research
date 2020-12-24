import React, { useState, useEffect, useContext } from "react";
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
import { CustomSelect } from "../Select";
import { Context } from "../../context";
import { isMobile } from "../../utils/helpers";

const useStyles = makeStyles({
  table: {
    minWidth: isMobile ? "unset" : 650,
    paddingRight: isMobile ? "unset" : 150,
  },
});

type Answer = {
  code: string;
  value: string;
  should_show: boolean;
};

type Variant = {
  code: number;
  value: string;
};

type Props = {
  answers: Answer[];
  variants: Variant[];
  // variants: string[];
};

export const DenseTable: React.FC<Props> = ({ answers, variants }) => {
  const classes = useStyles();
  const { setNextDsb } = useContext(Context)!;
  const [localAnswers, setLocalAnswers] = useState<any>({});

  useEffect(() => {
    const passed = Object.keys(localAnswers);
    if (
      answers.filter((item: any) => item.should_show).length === passed.length
    )
      setNextDsb(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localAnswers]);

  useEffect(() => {
    setLocalAnswers({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow
            style={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
          >
            <TableCell style={{ border: "none" }}>{TITLE}</TableCell>
            <TableCell
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                border: "none",
                alignItems: "flex-end",
                minHeight: 30,
              }}
            >
              {!isMobile &&
                variants.map((variant: Variant, index: number) => (
                  <div
                    style={{
                      width: variants.length < 10 ? 120 : "unset",
                      textAlign: "center",
                      paddingRight: variants.length > 5 ? 14 : "unset",
                      paddingLeft: variants.length > 5 ? 14 : "unset",
                    }}
                    key={variant.code}
                  >
                    {variants.length > 5 ? (
                      <span
                        style={{
                          position: "relative",
                          maxWidth: 38,
                          minWidth: 38,
                          minHeight: 25,
                        }}
                      >
                        {index === variants.length - 1 ? (
                          <div
                            style={{
                              position: "absolute",
                              top: -40,
                              left: -15,
                              textAlign: "left",
                              width: 140,
                            }}
                          >
                            {variant.value}
                          </div>
                        ) : (
                          variant.value
                        )}
                      </span>
                    ) : (
                      variant.value
                    )}
                  </div>
                ))}
            </TableCell>
            <TableCell style={{ width: 30 }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {answers.map((answer: Answer, index: number) =>
            answer.should_show ? (
              <TableRow key={answer.code}>
                <TableCell component="th" scope="row" style={{ maxWidth: 250 }}>
                  {answer.value}
                </TableCell>
                <TableCell>
                  {isMobile ? (
                    <CustomSelect
                      values={variants}
                      row_index={index}
                      setAnswers={setLocalAnswers}
                    />
                  ) : (
                    <Row
                      values={variants}
                      row_index={index}
                      setAnswers={setLocalAnswers}
                    />
                  )}
                </TableCell>
                <TableCell style={{ width: 30 }}></TableCell>
              </TableRow>
            ) : null
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
