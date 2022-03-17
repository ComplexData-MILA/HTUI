// ModelSelect but with the Data Grid component
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { 
    Select, 
    FormControl, 
    FormHelperText, 
    Tooltip, 
    MenuItem, 
    InputLabel, 
    InputBase, 
    TextField,
    OutlinedInput, 
    colors } from '@mui/material';
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


export default function NewModelSelect(props) {
    const { classes, apiHost, model, handleChange, providerOptions } = props
    
    return (
        <CssTextField
            id="outlined-select-models"
            select
            // label="Models"
            value={model}
            onChange={handleChange}
            helperText="Select a model"
            FormHelperTextProps={{
                className: classes.root
            }}
            inputProps={{
                classes: {
                    icon: classes.icon,
                    root: classes.root,
                },
            }}
            // InputLabelProps={{
            //     className: classes.inputLabel,
            // }}
            fullWidth
        >
            {Object.keys(providerOptions).map(function(name){
                // const obj = providerOptions[name]
                
                return(<Tooltip title={"providerOptions[name].description"} key={name} placement="left" value={name}>
                            <MenuItem value={name} key={name}>{name}</MenuItem>
                        </Tooltip>
                )
            })}
        </CssTextField>
    )
}
