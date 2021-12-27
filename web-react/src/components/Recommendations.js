import React, { useState } from 'react'
import { useQuery } from "react-query"
import {
    Box,
    Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import ModelSelect from './ModelSelect.js'

const apiHost = 'http://localhost:8001';

export default function Recommendations(props) {
  const {callback} = props
  const [recommendations, setRecs] = useState([]);

  const { isLoading, error, data, isFetching } = useQuery(["providers"], () =>
    fetch(`${apiHost}/providers/random?k=5`).then((res) => res.json())
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  // const data = [
  //   47404,
  //   53420,
  //   56315,
  //   14923,
  //   24809
  // ]
  console.log(data)

  const formatData = (data) => {
    const newArr = data.map(function(num) {
      return {id: num}
    });
    console.log(newArr)
    return newArr
  }

  // console.log(formatData(data))

  return (
      <React.Fragment>
      <Box sx={{ height: 400, bgcolor: 'background.paper' }}>
        {isLoading ? 
        <Typography>Loading</Typography>
        : 
        <DataGrid 
          onCellClick={callback}
          hideFooter 
          columns={[{ field: 'id' }]}
          rows={isLoading ? [] : recommendations}
          components={{
            Toolbar: ModelSelect,
          }}
        />}
      </Box>
    </React.Fragment>
  )
}