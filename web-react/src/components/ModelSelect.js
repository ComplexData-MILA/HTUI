import React, { useState } from 'react'
import { Select, FormControl, FormHelperText, InputLabel, MenuItem, InputBase, OutlinedInput, colors } from '@mui/material';
import { GridToolbarContainer } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/material/styles'

const BootstrapInput = styled(OutlinedInput)(({ theme }) => ({
    '& .MuiInputBase-input': {
      borderRadius: 4,
      border: '1px solid #fff',
      color: '#fff',
    },
    '&:focus': {
        borderRadius: 4,
        border: '1px solid #fff',
        color: '#fff',
    },
}));

export default function ModelSelect(props) {
    const { color, classes } = props
    const [model, setModel] = useState('')
    const models = ['Random', 'Random Walk', 'RedThread']; // get from the backend

    const handleChange = (event) => {
        console.log(event.target.value)
        setModel(event.target.value)
    }

    return (
        <GridToolbarContainer>
            <FormControl sx={{color: color}}fullWidth>
                {/* <InputLabel id="demo-simple-select-label" sx={{color: '#fff'}}>Model</InputLabel> */}
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={model}
                    // defaultValue="Random"
                    displayEmpty={true}
                    renderValue={()=> "Random"}
                    onChange={handleChange}
                    input={<BootstrapInput />}
                    inputProps={{
                        classes: {
                            icon: classes.icon,
                            root: classes.root,
                        }
                    }}
                >
                    {models.map((val) => <MenuItem value={val} key={val}>{val}</MenuItem>)}
                </Select>
                <FormHelperText sx={{color: color}}>Choose a Model</FormHelperText>
            </FormControl>
        </GridToolbarContainer>
    )
}