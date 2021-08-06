import React, { useState } from 'react'
import { useQuery, useLazyQuery, gql } from '@apollo/client'
import Graphin, { Utils, Behaviors } from '@antv/graphin'
import PersonIcon from '../img/person_black_24dp.svg'
import EmailIcon from '../img/alternate_email_black_24dp.svg'
import VehicleIcon from '../img/directions_car_black_24dp.svg'
import AddressIcon from '../img/home_black_24dp.svg'
import PhoneIcon from '../img/phone_black_24dp.svg'
import PhoneCallIcon from '../img/phone_in_talk_black_24dp.svg'
import AreaIcon from '../img/place_black_24dp.svg'
import '@antv/graphin/dist/index.css'
import {
  withStyles,
  TextField,
  Paper,
  Button,
  Grid,
  Box,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Title from './Title'
import getNextRecommended from './../actions/getNextRecommended'
import acceptNodes from './../actions/acceptNodes'
import rejectNodes from './../actions/rejectNodes'
// import { display } from '@material-ui/system'

// const walk = (node, callback) => {
//   callback(node)
//   if (node.children && node.children.length !== 0) {
//     node.children.forEach((n) => {
//       walk(n, callback)
//     })
//   }
// }

const { ClickSelect } = Behaviors

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
      id
      name
      surname
    }
  }
`

// const GET_GRAPH = gql`
//   query fileQuery($nameInput: String, $surnameInput: String) {
//     response(name: $nameInput, surname: $surnameInput)
//   }
// `

const GET_SUBGRAPH = gql`
  query subgraphQuery($seedNodes: [Int]) {
    Subgraph(seeds: $seedNodes)
  }
`

const toggleVisibility = () => {
  const feedbackArea = document.getElementById('AcceptAndReject')
  const currentVisibility = feedbackArea.style.display
  if (currentVisibility == 'none') {
    feedbackArea.style.display = 'block'
    document.getElementById('GetNextButton').display = 'none'
  } else if (currentVisibility == 'block') {
    feedbackArea.style.display = 'none'
  }
  getNextRecommended()
}

function GraphDisplay(props) {
  // declare useState hooks
  const { classes } = props
  const [subgraphNodes, setNodes] = useState([])

  const addSeedNode = (id) => {
    console.log(`Adding node ${id} to the visualization with existing nodes ${subgraphNodes}.`)
    setNodes([...subgraphNodes, parseInt(id)])
  }

  // const {
  //   error: errorPeople,
  //   data: allPeople,
  //   loading: loadingPeople,
  // } = useQuery(GET_PERSON, { variables: { filter: { name_CONTAINS: '' } } })

  // const {
  //   data: combinedData, 
  //   loading: combinedLoading, 
  //   error: combinedError 
  // } = useQuery(GET_SUBGRAPH, { variables: { seedNodes: subgraphNodes } })

  const people = useQuery(GET_PERSON, { variables: { filter: { name_CONTAINS: '' } } })
  const subgraph = useQuery(GET_SUBGRAPH, { variables: { seedNodes: subgraphNodes } })

  let err = people.error || subgraph.error
  if (err) {
    console.log(err)
    return <p>Error</p>
  }
  if (people.loading || subgraph.loading) return <p>Loading</p>

  let graphDisplayData = JSON.parse(subgraph.data.Subgraph)
  graphDisplayData.nodes.forEach(addNodeStyles)
  graphDisplayData.edges.forEach(addEdgeStyles)
  Utils.processEdges(graphDisplayData.edges, { poly: 50 })

  return (
    <React.Fragment>
      <Title>Person List</Title>
      <Autocomplete
        options={people.data.people}
        getOptionLabel={(option) => option.name + ' ' + option.surname}
        onChange={(event, value) => addSeedNode(value.id)}
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
      <div>
        <Title>Graph</Title>
        <Paper>
          <Grid
            component={Box}
            container
            justify="flex-end"
            display="block"
            id="GetNextButton"
          >
            <Button variant="contained" onClick={toggleVisibility}>
              Get Next Ad and Next Evidence Nodes
            </Button>
          </Grid>
          {/* previously, data={graphState.graphStateData} */}
          <Graphin data={graphDisplayData} layout={{ type: 'graphin-force' }}> {/* concentric */}
            <ClickSelect onClick={(e) => addSeedNode(e.item._cfg.id)}></ClickSelect>
          </Graphin>
          <div id="AcceptAndReject" style={{ display: 'none' }}>
            <Grid container justify="flex-end">
              <Button
                variant="contained"
                className={classes.acceptButton}
                onClick={acceptNodes}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                className={classes.rejectButton}
                onClick={rejectNodes}
              >
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
