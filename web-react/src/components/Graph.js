import React, { useState } from 'react'
import { useQuery, useLazyQuery, gql } from '@apollo/client'
import Graphin, { Utils } from '@antv/graphin'
import PersonIcon from '~/../../img/person_black_24dp.svg'
import EmailIcon from '~/../../img/alternate_email_black_24dp.svg'
import VehicleIcon from '~/../../img/directions_car_black_24dp.svg'
import AddressIcon from '~/../../img/home_black_24dp.svg'
import PhoneIcon from '~/../../img/phone_black_24dp.svg'
import PhoneCallIcon from '~/../../img/phone_in_talk_black_24dp.svg'
import AreaIcon from '~/../../img/place_black_24dp.svg'
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

// const icons = Graphin.registerFontFamily(IconLoader)
//written in JSS not CSS
const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300,
  },
  whiteText: {
    color: 'white',
  },
  acceptButton: {
    background: 'green',
    color: 'white',
  },
  rejectButton: {
    background: 'red',
    color: 'white',
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
    error: errorPeople,
    data: allPeople,
    loading: loadingPeople,
  } = useQuery(GET_PERSON, { variables: { filter: { name_CONTAINS: '' } } })

  const [getGraph, { loading, error }] = useLazyQuery(GET_GRAPH, {
    onCompleted: (data) => manipulateData(data),
  })

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

  if (errorPeople) return <p>ERROR</p>
  if (loadingPeople) return <p>LOADING</p>
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

  const toggleVisibility = () => {
    const feedbackArea = document.getElementById('AcceptAndReject')
    const currentVisibility = feedbackArea.style.display
    if (currentVisibility == 'none') {
      feedbackArea.style.display = 'block'
    } else if (currentVisibility == 'block') {
      feedbackArea.style.display = 'none'
    }
    console.log('1')
    const newData = graphState.graphStateData
    newData.nodes.forEach(makeNodesInactive)
    console.log('2')
    setGraphState((oldGraphState) => ({
      ...oldGraphState,
      graphStateData: newData,
    }))
    console.log('3')
    console.log(graphState.graphStateData)
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
            <Button variant="contained" onClick={toggleVisibility}>
              Get Next Ad and Next Evidence Nodes
            </Button>
          </Grid>
          <Graphin
            data={graphState.graphStateData}
            layout={{ type: 'concentric' }}
          ></Graphin>
          <div id="AcceptAndReject" style={{ display: 'none' }}>
            <Grid container justify="flex-end">
              <Button variant="contained" className={classes.acceptButton}>
                Accept
              </Button>
              <Button variant="contained" className={classes.rejectButton}>
                Reject
              </Button>
            </Grid>
          </div>
        </Paper>
      </div>
    </React.Fragment>
  )
}

export default withStyles(styles)(GraphDisplay)

function addNodeStyles(node) {
  let labelValue = ''
  let iconValue
  let color = ''
  if (node.label == 'Person') {
    labelValue = node.name + ' ' + node.surname
    iconValue = PersonIcon
    color = 'orange'
  } else if (node.label == 'Email') {
    labelValue = node.email_address
    iconValue = EmailIcon
    color = 'red'
  } else if (node.label == 'Location') {
    labelValue = node.address
    iconValue = AddressIcon
    color = 'green'
  } else if (node.label == 'Phone') {
    labelValue = node.phoneNo
    iconValue = PhoneIcon
    color = 'purple'
  } else if (node.label == 'Area') {
    labelValue = node.areaCode
    iconValue = AreaIcon
    color = 'pink'
  } else if (node.label == 'Crime') {
    labelValue = 'crime: ' + node.type
  } else if (node.label == 'PostCode') {
    labelValue = 'postcode: ' + node.code
    iconValue = AreaIcon
    color = 'pink'
  } else if (node.label == 'PhoneCall') {
    labelValue = 'Phone Call'
    iconValue = PhoneCallIcon
    color = 'purple'
  } else if (node.label == 'Vehicle') {
    labelValue = node.make + ' ' + node.model
    iconValue = VehicleIcon
    color = 'white'
  }

  node.style = {
    label: {
      value: labelValue,
    },
    icon: {
      type: 'image',
      value: iconValue,
      size: [20, 20],
    },
    keyshape: {
      fill: color,
      stroke: color,
      opacity: 1,
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

function makeNodesInactive(node) {
  // node.status = {
  //   disabled: true,
  // }
  node.style = {
    keyshape: {
      fill: 'red',
    },
  }
}
