import React, { useState } from 'react'
// import React, { useEffect } from 'react'
import { useQuery, useLazyQuery, gql } from '@apollo/client'
// import Graphin from '@antv/graphin'
import Graphin, { Utils } from '@antv/graphin'
import '@antv/graphin/dist/index.css'
import { withStyles, TextField, Paper, Button, Grid } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Title from './Title'

// const walk = (node, callback) => {
//   callback(node)
//   if (node.children && node.children.length !== 0) {
//     node.children.forEach((n) => {
//       walk(n, callback)
//     })
//   }
// }

//written in JSS not CSS
const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300,
  },
  getNextNodesButton: {
    // position: 'relative',
    // right: 0,
    // top: 0,
    marginRight: 8,
    marginTop: 8,
  },
})

//graphql queries
const GET_PERSON = gql`
  query peoplePaginateQuery($filter: PersonWhere) {
    people(where: $filter) {
      name
      surname
    }
  }
`

const GET_GRAPH = gql`
  query fileQuery($nameInput: String, $surnameInput: String) {
    response(name: $nameInput, surname: $surnameInput)
  }
`

function GraphDisplay(props) {
  // declare useState hooks
  const { classes } = props
  const [graphState, setGraphState] = useState({
    graphStateData: Utils.mock(13).circle().graphin(),
  })

  const {
    error: errorAll,
    data: allPeople,
    loading: loadingAll,
  } = useQuery(GET_PERSON, { variables: { filter: { name_CONTAINS: '' } } })

  const [getGraph, { loading, error }] = useLazyQuery(GET_GRAPH, {
    onCompleted: (data) => manipulateData(data),
  })

  if (errorAll) return <p>ERROR</p>
  if (loadingAll) return <p>LOADING</p>
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

  const checkEnter = (event) => {
    if (event.keyCode == 13) {
      const val = event.target.value

      const nameArr = val.split(' ', 2)
      getGraph({
        variables: { nameInput: nameArr[0], surnameInput: nameArr[1] },
      })
    }
  }
  const manipulateData = (inputData) => {
    let graphData = JSON.parse(inputData.response)
    graphData.nodes.forEach(addNodeStyles)
    graphData.edges.forEach(addEdgeStyles)
    Utils.processEdges(graphData.edges, { poly: 50 })
    setGraphState((oldGraphState) => ({
      ...oldGraphState,
      graphStateData: graphData,
    }))
  }

  return (
    <React.Fragment>
      <Title>Person List</Title>
      <Autocomplete
        id="combo-box-input"
        options={allPeople.people.map(
          (option) => option.name + ' ' + option.surname
        )}
        disableClearable
        renderInput={(params) => (
          <TextField
            id="search"
            className={classes.textField}
            {...params}
            label="Search for a person"
            margin="normal"
            variant="outlined"
            onKeyUp={(e) => checkEnter(e)}
            InputProps={{
              ...params.InputProps,
              type: 'search',
              className: classes.input,
            }}
          />
        )}
      />
      <div>
        <Title>Graph</Title>
        <Paper>
          <Grid container justify="flex-end">
            <Button variant="contained" onClick={toggleVisibilityAC}>
              Get Next Ad and Next Evidence Nodes
            </Button>
          </Grid>
          <Graphin
            data={graphState.graphStateData}
            layout={{ type: 'concentric' }}
          ></Graphin>
          <div id="AcceptAndReject" style={{ display: 'none' }}>
            <Grid container justify="flex-end">
              <Button variant="contained">Accept</Button>
              <Button variant="contained">Reject</Button>
            </Grid>
          </div>
        </Paper>
      </div>
    </React.Fragment>
  )
}

export default withStyles(styles)(GraphDisplay)

function toggleVisibilityAC() {
  const feedbackArea = document.getElementById('AcceptAndReject')
  const currentVisibility = feedbackArea.style.display
  if (currentVisibility == 'none') {
    feedbackArea.style.display = 'block'
  } else if (currentVisibility == 'block') {
    feedbackArea.style.display = 'none'
  }
}

function addNodeStyles(node) {
  let value = ''
  if (node.label == 'Person') {
    value = node.name + ' ' + node.surname
  } else if (node.label == 'Email') {
    value = node.email_address
  } else if (node.label == 'Location') {
    value = node.address
  } else if (node.label == 'Phone') {
    value = node.phoneNo
  } else if (node.label == 'Area') {
    value = node.areaCode
  } else if (node.label == 'Crime') {
    value = 'crime: ' + node.type
  } else if (node.label == 'PostCode') {
    value = 'postcode: ' + node.code
  } else if (node.label == 'PhoneCall') {
    value = 'Phone Call'
  }

  node.style = {
    label: {
      value: [value],
    },
  }
}

function addEdgeStyles(edge) {
  edge.style = {
    label: {
      value: edge.label,
    },
  }
}
