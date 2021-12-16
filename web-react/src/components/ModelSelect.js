import React, { useState } from 'react'
import { Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import { GridToolbarContainer } from '@mui/x-data-grid';

export default function ModelSelect() {
    const [model, setModel] = useState('')

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
                    <MenuItem value={'Random selection'}>Random selection</MenuItem>
                    <MenuItem value={'Random walk'}>Random walk</MenuItem>
                    <MenuItem value={'Red Thread'}>Red Thread</MenuItem>
                </Select>
            </FormControl>
        </GridToolbarContainer>
    )
}