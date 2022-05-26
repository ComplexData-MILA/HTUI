import React, { useState, useEffect } from 'react'
import { useQuery } from "react-query"
import {
    Box,
    Typography,
    Tooltip,
    MenuItem,
    TextField,
    Card,
    CardActions,
    CardContent,
    CardMedia, 
    Button
} from '@mui/material'
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid'
import {default as ModelSelect} from './ModelSelect.js'
import {default as NewModelSelect} from './NewModelSelect.js'
import {default as InfoCards} from './InfoCards.js'
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
  const { callback, 
          apiHost, 
          classes, 
          theme, 
          seedNodes, 
          setSelected,
          getLabel
        } = props
  const [model, setModel] = useState('Random')
  const [recs, setRecs] = useState([])
  
  const handleChange = (event) => {
    // console.log(event)
    // console.log(event.target.value)
    setModel(event.target.value)
  }

  // getting the different models
  const { isLoading: isLoadingModels, error: errorModels, data:providerOptions } = useQuery(["models"], () =>
      fetch(`${apiHost}/provider`).then((res) => res.json())
  );
  
  // formatting the request body for getting recs
  const providerFetch = () => {
    var bodyContent = JSON.stringify({ k: 5 });
    if (model == "Random") {
      bodyContent = JSON.stringify({ k: 5 });
    } else if (model == "PageRank") {
      // var obj = {}
      // obj["node_ids"] = seedNodes
      bodyContent = JSON.stringify({ k: 5, state: {nodeIds: seedNodes}, maxIterations: 20})
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

  // getting the info for each recommended node
  const infoFetch = () => {
    console.log("in info fetch")
    var bodyContent = JSON.stringify({ node_ids: data });
    console.log(bodyContent)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyContent
    };
    return fetch(`${apiHost}/graph/pole/info`, requestOptions).then((res) => res.json())
  }

  const { isLoading: infoLoading, error: infoError, data: infoData} = useQuery(["info", data], infoFetch);

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

  if (infoError) {
    return <div>Error: {errorModels.message}</div>;
  }

  if (infoLoading) {
      return <div>Loading...</div>;
  }
  console.log(infoData)
  const formatData = (data) => {
    console.log(data)
    
    const newArr = data.map(function(arr, idx) {
      const label = infoData[idx].labels[0]
      const properties = Object.values(infoData[idx].properties)
      console.log(infoData[idx])
      const displayVal = getLabel(infoData[idx].labels[0], infoData[idx].properties)
      console.log(displayVal)
      return {id:arr, group: label, node: displayVal}
    });
    // console.log(newArr)
    // setRecs(newArr)
    

    return newArr
  };


  return (
      <React.Fragment>
      <Box sx={{ height: 400 }}>
        {isLoading ? 
        <Typography>Loading</Typography>
        : 
        <DataGrid 
          // onCellClick={(event) => callback(event.id)}
          hideFooter 
          checkboxSelection
          columns={[{ field: 'group' }, {field: 'node'}]}
          rows={isLoading ? [] : formatData(data)}
          onSelectionModelChange={elem => setSelected(elem)}
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
        // <NewModelSelect
        //   classes={classes}
        //   apiHost={apiHost}
        //   model={model}
        //   handleChange={handleChange}
        //   providerOptions={providerOptions}
        // >
        // </NewModelSelect>
        // <InfoCards
        //   infoData={infoData}
        //   callback={callback}
        // ></InfoCards>
      }
      </Box>
    </React.Fragment>
  )
}