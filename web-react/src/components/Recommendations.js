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
  const {callback, apiHost, classes, theme, seedNodes} = props
  // const [recommendations, setRecs] = useState([]);

  const providerFetch = () => {
    return fetch(`${apiHost}/provider/random/recommend?k=5&m=random`).then((res) => res.json())
  }

  const { isLoading, error, data} = useQuery(["provider", seedNodes], providerFetch);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const formatData = (data) => {
    const newArr = data.map(function(num) {
      return {id: num}
    });
    // console.log(newArr)
    return newArr
  }

  return (
      <React.Fragment>
      <Box sx={{ height: 400 }}>
        {isLoading ? 
        <Typography>Loading</Typography>
        : 
        <DataGrid 
          onCellClick={(event) => callback(event.id)}
          hideFooter 
          columns={[{ field: 'id' }]}
          rows={formatData(data)}
          components={{
            Toolbar: ModelSelect,
          }}
          componentsProps={{
            toolbar: {
              color: theme.palette.secondary.contrastText,
              classes: classes,
            }
          }}
          className={classes.paper}
        />
        }
      </Box>
    </React.Fragment>
  )
}