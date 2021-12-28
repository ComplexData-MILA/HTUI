import React, { useState, useEffect } from 'react'
import { useQuery } from "react-query"
import {
    Box,
    Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import ModelSelect from './ModelSelect.js'

// const apiHost = process.env.REACT_APP_API_HOST || 'http://localhost:8000';

export default function Recommendations(props) {
  const {callback, apiHost} = props
  const [recommendations, setRecs] = useState([]);

  const { isLoading, error, data, isFetching } = useQuery(["provider"], () =>
    fetch('http://localhost:8000/provider/random/recommend?k=5').then((res) => res.json())
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const formatData = (data) => {
    console.log(data)
    const newArr = data.map(function(num) {
      return {id: num}
    });
    console.log(newArr)
    return newArr
  }

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
          rows={formatData(data)}
          components={{
            Toolbar: ModelSelect,
          }}
        />
        }
      </Box>
    </React.Fragment>
  )
}