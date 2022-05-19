import * as React from 'react';
import { useQuery } from "react-query"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];
var rows1 = {}

export default function NodeInfoTable(props) {
  const { apiHost, currSelectedNode } = props
  // info function for the node info floating table when node is clicked
  
  const infoFetch = () => {
    console.log("in info fetch")
    var bodyContent = JSON.stringify({ node_ids: currSelectedNode });
    console.log(bodyContent)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyContent
    };
    return fetch(`${apiHost}/graph/pole/info`, requestOptions).then((res) => res.json())
  }

  const { isLoading: infoLoading, error: infoError, data: infoData} = useQuery(["info", currSelectedNode], infoFetch);

  if (infoError) {
    return <div>Error</div>;
  }

  if (infoLoading) {
    return <div>Loading...</div>;
  }
  // print(infoData)

  if (infoData.length != 0){
    rows1 = {"label": infoData[0].labels[0]}
    rows1 = Object.assign(rows1, infoData[0].properties)
    console.log(rows1)
  }

  return (
    <TableContainer component={Paper} sx={{width: 200, zIndex: 1}}>
      {infoData.length!=0 && <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Properties</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(rows1).map((row) => (
            <TableRow
              key={row}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row}
              </TableCell>
              <TableCell component="th" scope="row">
                {rows1[row]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>}
    </TableContainer>
  );
}
