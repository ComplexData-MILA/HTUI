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

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    // '& .MuiInputBase-input': {
    //   borderRadius: 4,
    //   border: '1px solid #fff',
    //   color: '#fff',
    // },
    // '&:focus': {
    //     borderRadius: 4,
    //     border: '1px solid #fff',
    //     color: '#fff',
    // },
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        border: '1px solid #fff',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
          borderRadius: 4,
          borderColor: '#80bdff',
          boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}));

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: '#fafafa',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#fafafa',
    },
    '& .MuiInputLabel-root': {
      color: '#bdbdbd',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#bdbdbd',
        color: '#fff',
      },
      '&:hover fieldset': {
        borderColor: '#fafafa',
        color: '#fff',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#fafafa',
        color: '#fff',
      },
    },
  });

export default function ModelSelect(props) {
    const { color, classes } = props
    const [model, setModel] = useState('Random')
    const models = ['Random', 'Random Walk', 'RedThread']; // get from the backend

    const handleChange = (event) => {
        console.log(event.target.value)
        setModel(event.target.value)
    }

    const algDescriptions = ["about random", "about pagerank", "about others"]

    return (
        <GridToolbarContainer>
            {/* <FormControl sx={{color: color}}fullWidth>
                <InputLabel id="demo-simple-select-label" sx={{color: '#fff'}}>Random</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={model}
                    defaultValue="Random"
                    // displayEmpty={true}
                    // renderValue={()=> "Random"}
                    onChange={handleChange}
                    input={<BootstrapInput />}
                    inputProps={{
                        classes: {
                            icon: classes.icon,
                            root: classes.root,
                        }
                    }}
                >
                    {models.map((val, index) => 
                        <Tooltip title={algDescriptions[index]} key={val} placement="left">
                            <MenuItem value={val} key={val}>{val}</MenuItem>
                        </Tooltip>
                    )}
                </Select>
                <FormHelperText sx={{color: color}}>Choose a Model</FormHelperText>
            </FormControl> */}
            <CssTextField
                id="outlined-select-models"
                select
                label="Models"
                value={model}
                defaultValue="Random"
                onChange={handleChange}
                helperText="Please select a model"
                FormHelperTextProps={{
                    className: classes.root
                }}
                inputProps={{
                    classes: {
                        icon: classes.icon,
                        root: classes.root,
                    }
                }}
            >
                    {models.map((val, index) => 
                        <Tooltip title={algDescriptions[index]} key={val} placement="left">
                            <MenuItem value={val} key={val}>{val}</MenuItem>
                        </Tooltip>
                    )}
            </CssTextField>
        </GridToolbarContainer>
    )
}