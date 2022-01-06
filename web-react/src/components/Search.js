import React, { useState, useEffect } from 'react'
import '@antv/graphin/dist/index.css' // may be removed in the future by antv
import {
    TextField,
    Autocomplete,
} from '@mui/material'
import { useQuery } from "react-query";


export default function SearchBar(props) {
    const { classes, callback, apiHost, Custom } = props
    const [textInput, setTextInput] = useState('');

    const handleTextInputChange = event => {
        setTextInput(event.target.value);
    };

    const { isLoading, error, data, isFetching } = useQuery(["search", textInput], () =>
        fetch(`${apiHost}/graph/pole/search?q=${textInput}`).then((res) => res.json())
    );

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // TODO [maybe]: Handle state in autocomplete instead of textfield
    // https://stackoverflow.com/questions/63295924/a-component-is-changing-an-uncontrolled-autocomplete-to-be-controlled
    return (
        <Autocomplete
            options={isLoading ? [] : data}
            getOptionLabel={(option) => option.value}
            onChange={callback}
            noOptionsText={isLoading ? 'Loading...' : 'No options'}
            // value={textInput}
            // onInputChange={handleTextInputChange}
            disableClearable
            renderInput={(params) => (
                <TextField
                    id="search"
                    className={classes.textField}
                    value= {textInput}
                    onChange= {handleTextInputChange}
                    label={textInput == '' ? "Search for an entity" : ''}
                    margin="normal"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        type: 'search',
                        classes: {
                            icon: classes.icon,
                        },
                        style: {
                            color: classes.root
                        }
                    }}
                    color="primary"
                    {...params}
                />
            )}
        />
    )
}