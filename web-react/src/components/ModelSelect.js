import React, { useState } from 'react'
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
import { GridToolbarContainer } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles'
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

export default function ModelSelect(props) {
    const { color, classes } = props
    const [model, setModel] = useState('')
    const models = ['Random', 'Random Walk', 'RedThread']; // get from the backend

    const handleChange = (event) => {
        console.log(event)
        console.log(event.target.value)
        setModel(event.target.value)
    }

    const algDescriptions = ["about random", "about pagerank", "about others"]

    return (
        <GridToolbarContainer>
            <CssTextField
                id="outlined-select-models"
                select
                // label="Models"
                value={model || 'Random'}
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
                {models.map((val, index) => 
                    <Tooltip title={algDescriptions[index]} key={val} placement="left" value={val}>
                        <MenuItem value={val} key={val}>{val}</MenuItem>
                    </Tooltip>
                )}
            </CssTextField>
        </GridToolbarContainer>
    )
}