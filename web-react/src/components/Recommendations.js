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
  const {callback, apiHost, classes} = props
  const [recommendations, setRecs] = useState([]);

  const providerFetch = () => {
    return fetch('http://localhost:8000/provider/random/recommend?k=5').then((res) => res.json())
  }

  const { isLoading, error, data, refetch } = useQuery(["provider"], providerFetch);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const formatData = (data) => {
    if (!data) {
      refetch()
    }

    const newArr = data.map(function(num) {
      return {id: num}
    });
    // console.log(newArr)
    return newArr
  }

  // refetch()
  const addRedo = (event) => {
    callback(event.id)
    refetch()
  }

  return (
      <React.Fragment>
      <Box sx={{ height: 400 }}>
        {isLoading ? 
        <Typography>Loading</Typography>
        : 
        <DataGrid 
          onCellClick={addRedo}
          hideFooter 
          columns={[{ field: 'id' }]}
          rows={formatData(data)}
          components={{
            Toolbar: ModelSelect,
          }}
          className={classes.paper}
        />
        }
      </Box>
    </React.Fragment>
  )
}