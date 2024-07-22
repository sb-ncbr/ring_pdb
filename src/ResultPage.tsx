import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  CircularProgress,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

// Define types for the data
interface TableData {
  [key: string]: never;
}

interface Params {
  jobID: string;
}

export const ResultPage: React.FC = () => {
  const { jobID } = useParams<Params>();
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState<TableData[]>([]);

  useEffect(() => {
    axios.get(`/api/conf-comparer/results/${jobID}`).then((res) => {
      setTableData(res.data.tablejson);
      setIsLoading(false);
    });
  }, [jobID]);

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" align="center">
          Results of Conformation Comparison
        </Typography>
      </Box>
      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {tableData.length > 0 &&
                  Object.keys(tableData[0]).map((key) => (
                    <TableCell key={key}>{key}</TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, idx) => (
                    <TableCell key={idx}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};
