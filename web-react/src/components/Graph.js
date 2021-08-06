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

const GET_COMBINED_GRAPH = gql`
  query subgraphQuery($listInput: [Int]) {
    combinedGraph(list: $listInput)
  }
`

function GraphDisplay(props) {
  // declare useState hooks
  const { classes } = props
  // const [graphState, setGraphState] = useState({
  //   graphStateData: Utils.mock(0).circle().graphin(),
  // })
  let graphDisplayData = {}
  const [subgraphNodes, setNodes] = useState([])

  const {
    error: errorPeople,
    data: allPeople,
    loading: loadingPeople,
  } = useQuery(GET_PERSON, { variables: { filter: { name_CONTAINS: '' } } })

  // const [getNeighborsGraph, { loading, error }] = useLazyQuery(GET_GRAPH, {
  //   onCompleted: (data) => manipulateData(JSON.parse(data.response)),
  // })

  const [
    getSubgraph,
    { data: combinedData, loading: combinedLoading, error: combinedError },
  ] = useLazyQuery(GET_COMBINED_GRAPH)

  // const manipulateData = (inputData) => {
  //   inputData.nodes.forEach(addNodeStyles)
  //   inputData.edges.forEach(addEdgeStyles)
  //   Utils.processEdges(inputData.edges, { poly: 50 })
  //   // setGraphState((oldGraphState) => ({
  //   //   ...oldGraphState,
  //   //   graphStateData: inputData,
  //   // }))
  //   graphDisplayData = inputData
  //   console.log(graphDisplayData)
  // }

  if (errorPeople || combinedError) return <p>Error</p>
  if (loadingPeople || combinedLoading) return <p>Loading</p>
  console.log('graphDisplayData')
  console.log(graphDisplayData)
  console.log('combinedData')
  console.log(combinedData)
  if (combinedData) {
    console.log(subgraphNodes)
    let parsedObject = JSON.parse(combinedData.combinedGraph)
    parsedObject.nodes.forEach(function (node) {
      addNodeStyles(node, subgraphNodes)
    })
    parsedObject.edges.forEach(addEdgeStyles)
    Utils.processEdges(parsedObject.edges, { poly: 50 })
    graphDisplayData = parsedObject
    console.log(graphDisplayData)
  }

  const checkEnter = (event) => {
    // console.log(event)
    if (event.keyCode == 13) {
      // const val = event.target.value

      // const nameArr = val.split(' ', 2)

      // getNeighborsGraph({
      //   variables: { nameInput: nameArr[0], surnameInput: nameArr[1] },
      // })
      // console.log(event.target.id)
      // const clickedNodeID = parseInt(event.target.id)
      // console.log(clickedNodeID)
      // const newArr = []
      // newArr.push(clickedNodeID)
      // console.log(newArr)
      // setNodes(newArr)
      // console.log(subgraphNodes)
      getSubgraph({ variables: { listInput: subgraphNodes } })
    }
  }

  const getID = (event) => {
    const id = parseInt(event.item._cfg.id)
    console.log(id)
    const arr = subgraphNodes
    arr.push(id)
    setNodes(arr)
    console.log(subgraphNodes)
    getSubgraph({
      variables: { listInput: subgraphNodes },
    })
  }

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

  const addSeedNode = (id) => {
    console.log('in addSeedNode')
    // console.log('event')
    console.log('id')
    console.log(id)
    const newArr = []
    newArr.push(id)
    setNodes(newArr)
  }

  return (
    <React.Fragment>
      <Title>Person List</Title>
      <Autocomplete
        options={allPeople.people}
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
          <Graphin data={graphDisplayData} layout={{ type: 'graphin-force' }}>
            <ClickSelect onClick={getID}></ClickSelect>
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

function addNodeStyles(node, selectedNodes) {
  // adding styles
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

  // add highlight to seed nodes
  if (selectedNodes.includes(parseInt(node.id))) {
    node.status = {
      selected: true,
    }
  }
}

function addEdgeStyles(edge) {
  edge.style = {
    label: {
      value: edge.label,
    },
  }
}
