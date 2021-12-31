import React, { useState } from 'react'
import { Select, FormControl, FormHelperText, InputLabel, MenuItem, InputBase, OutlinedInput } from '@mui/material';
import { GridToolbarContainer } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/material/styles'

const useStyles = makeStyles((theme) => ({
    components: {
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderColor: '#fff',
                },
            },
        },
    },
    icon: {
        fill: 'white',
    },
    root: {
        color: 'white',
    },
    select: {
        "& .MuiInputBase-input": {
            border: '#fff',
        },
    },
}))
const BootstrapInput = styled(OutlinedInput)(({ theme }) => ({
    '& .MuiInputBase-input': {
      borderRadius: 4,
      border: '1px solid #fff',
      color: '#fff',
    },
    '&:focus': {
        borderRadius: 4,
        borderColor: '#fff',
        color: '#fff',
    },
  }));

export default function ModelSelect() {
    const classes = useStyles()
    const [model, setModel] = useState('')
    const models = ['Random', 'Random Walk', 'RedThread']; // get from the backend

    const handleChange = (event) => {
        console.log(event.target.value)
        setModel(event.target.value)
    }

    return (
        <GridToolbarContainer>
            <FormControl sx={{color: '#fff'}}fullWidth>
                <InputLabel id="demo-simple-select-label" sx={{color: '#fff'}}>Model</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={model}
                    onChange={handleChange}
                    // classes={classes.select}
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
                <FormHelperText sx={{color: '#fff'}}>Choose a Model</FormHelperText>
            </FormControl>
        </GridToolbarContainer>
    )
}