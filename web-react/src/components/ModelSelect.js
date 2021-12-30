import React, { useState } from 'react'
import { Select, FormControl, FormHelperText, InputLabel, MenuItem } from '@mui/material';
import { GridToolbarContainer } from '@mui/x-data-grid';

export default function ModelSelect() {
    const [model, setModel] = useState('')
    const models = ['Random', 'Random Walk', 'RedThread']; // get from the backend

    const handleChange = (event) => {
        console.log(event.target.value)
        setModel(event.target.value)
    }

    return (
        <GridToolbarContainer>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Model</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={model}
                    label="Model"
                    onChange={handleChange}
                >
                    {models.map((val) => <MenuItem value={val} key={val}>{val}</MenuItem>)}
                </Select>
                <FormHelperText>Default: Random</FormHelperText>
            </FormControl>
        </GridToolbarContainer>
    )
}