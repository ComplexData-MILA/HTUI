import React, { useState, useEffect } from 'react'
import { useQuery } from "react-query"
import {
    Box,
    Typography,
    Tooltip,
    MenuItem,
    TextField
} from '@mui/material'
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid'
import {default as ModelSelect, getOptions} from './ModelSelect.js'
import { styled } from '@mui/material/styles'

const CssTextField = styled(TextField)({
  '& .MuiInput-underline:after': {
    borderBottomColor: '#fafafa',
  },
  '& .MuiButtonBase-root': {
      color: '#fff',
      padding: '0 0 0 0'
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#bdbdbd',
    },
    '&:hover fieldset': {
      borderColor: '#fafafa',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#fafafa',
    },
  },
});

export default function Recommendations(props) {
  const {callback, apiHost, classes, theme, seedNodes} = props
  const [model, setModel] = useState('Random')
  
  const handleChange = (event) => {
    // console.log(event)
    // console.log(event.target.value)
    setModel(event.target.value)
  }

  const { isLoading: isLoadingModels, error: errorModels, data:providerOptions } = useQuery(["models"], () =>
      fetch(`${apiHost}/provider`).then((res) => res.json())
  );
  // const options = getOptions()

  const providerFetch = () => {
    var bodyContent = JSON.stringify({ k: 5 });
    if (model == "Random") {
      bodyContent = JSON.stringify({ k: 5 });
    } else if (model == "PageRank") {
      // var obj = {}
      // obj["node_ids"] = seedNodes
      bodyContent = JSON.stringify({ k: 10, state: {nodeIds: seedNodes}, maxIterations: 20})
    }
    console.log(bodyContent)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyContent
    };
    console.log(model)
    const endpoint = providerOptions ? providerOptions[model].endpoint : '/provider/random'
    console.log(endpoint)
    return fetch(`${apiHost}${endpoint}/`, requestOptions).then((res) => res.json())
  }

  const { isLoading, error, data} = useQuery(["provider", seedNodes, model], providerFetch);

  if (errorModels) {
      return <div>Error: {errorModels.message}</div>;
  }

  if (isLoadingModels) {
      return <div>Loading...</div>;
  }

  if (error) {
    // console.log(error)
    return <div>Error: {error.message}</div>;
  }

  const formatData = (data) => {
    console.log(data)
    const newArr = data.map(function(arr) {
      return {id: arr[0], type: arr[1]}
    });
    // console.log(newArr)
    // setRecs(newArr)
    return newArr
  }

  return (
      <React.Fragment>
      <Box sx={{ height: 400 }}>
        {/* {isLoading ? 
        <Typography>Loading</Typography>
        :  */}
        <DataGrid 
          onCellClick={(event) => callback(event.id)}
          hideFooter 
          columns={[{ field: 'id' }, { field: 'type' }]}
          rows={isLoading ? [] : formatData(data)}
          components={{
            Toolbar: ModelSelect,
          }}
          componentsProps={{
            toolbar: {
              // color: theme.palette.secondary.contrastText,
              classes: classes,
              apiHost: apiHost,
              model: model,
              handleChange: handleChange,
              // setModel: setModel,
              providerOptions: providerOptions,
            }
          }}
          className={classes.paper}
        />
        {/* }  */}
      </Box>
    </React.Fragment>
  )
}