import React, { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import '@antv/graphin/dist/index.css' // may be removed in the future by antv
import {
  TextField,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'


export default function SearchBar(props) {
  // declare useState hooks
  const { classes, callback, apiHost } = props
  const [people, setPeople] = useState([])
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // temporarily hardcode
  // const people = [{name: "Harold", surname: "Oliver", id: 1162}];
  // const fetchPeople = () => {
  //   fetch(`${API_HOST}/allpeople`)
  //   .then(response => response.json())
  // }
  // const people = fetchPeople()
  // console.log(people)
  // use hook with setPeople in .then, useEffect
  useEffect(() => {
    fetch(`${apiHost}/allpeople`)
        .then(response => response.json())
        .then(
          data => { setIsLoaded(true); setPeople(data); console.log(data) },
          error => {
            setIsLoaded(true);
            setError(error);
          }
        );
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <Autocomplete
        // options={people.data.people}
        options={people}
        getOptionLabel={(option) => option.value}
        onChange={callback} //{(event, value) => addSeedNode(value.id)}
        disableClearable
        renderInput={(params) => (
          <TextField
            id="search"
            className={classes.textField}
            {...params}
            label="Search for a person"
            margin="normal"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              type: 'search',
              className: classes.input,
            }}
          />
        )}
      />
  )
}

// export default withStyles(styles)(GraphDisplay)