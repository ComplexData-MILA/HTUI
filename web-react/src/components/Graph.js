import React, { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import Graphin, { Utils, Behaviors } from '@antv/graphin'
import { Tooltip } from '@antv/graphin-components'
import PersonIcon from '../img/person_black_24dp.svg'
import EmailIcon from '../img/alternate_email_black_24dp.svg'
import VehicleIcon from '../img/directions_car_black_24dp.svg'
import AddressIcon from '../img/home_black_24dp.svg'
import PhoneIcon from '../img/phone_black_24dp.svg'
import PhoneCallIcon from '../img/phone_in_talk_black_24dp.svg'
import AreaIcon from '../img/place_black_24dp.svg'
import '@antv/graphin/dist/index.css' // may be removed in the future by antv
import {
  withStyles,
  TextField,
  Paper,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core'
// import { DataGrid } from '@mui/x-data-grid'
// import { Stack } from '@mui/material'
import Title from './Title'
import getNextRecommended from './../actions/getNextRecommended'
import acceptNodes from './../actions/acceptNodes'
import rejectNodes from './../actions/rejectNodes'

import SearchBar from './Search';
import NodeTooltip from './Tooltip'

// const walk = (node, callback) => {
//   callback(node)
//   if (node.children && node.children.length !== 0) {
//     node.children.forEach((n) => {
//       walk(n, callback)
//     })
//   }
// }
const API_HOST = process.env.REACT_APP_API_HOST || 'http://localhost:8000';
console.log(`API hosted at ${API_HOST}.`)

const { ClickSelect } = Behaviors

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
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [graph, setGraph] = useState({nodes: [], edges: []})

  const addSeedNode = (id) => {
    console.log(
      `Adding node ${id} to the visualization with existing nodes ${subgraphNodes}.`
    )
    setNodes([...subgraphNodes, parseInt(id)])
  }

  // const people = useQuery(GET_PERSON, {
  //   variables: { filter: { name_CONTAINS: '' } },
  // })
  // const subgraph = useQuery(GET_SUBGRAPH, {
  //   variables: { seedNodes: subgraphNodes },
  // })

  // let err = people.error || subgraph.error
  // if (err) {
  //   console.log(err)
  //   return <p>Error</p>
  // }
  // if (people.loading || subgraph.loading) return <p>Loading</p>
  // 
  // let graphDisplayData = JSON.parse(subgraph.data.Subgraph)

  useEffect(() => {
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ node_ids: subgraphNodes })
      };
      fetch(`${API_HOST}/subgraph`, requestOptions)
          .then(response => response.json())
          .then(
            data => { setIsLoaded(true); setGraph(data); console.log(data); console.log(subgraphNodes) },
            error => {
              setIsLoaded(true);
              setError(error);
            }
          );
  }, [subgraphNodes]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  }

  console.log({ graph, error, isLoaded })
  let graphDisplayData = graph; // getSubgraph(subgraphNodes)
  graphDisplayData.nodes.forEach(function (node) {
    addNodeStyles(node, subgraphNodes)
  })
  graphDisplayData.edges.forEach(addEdgeStyles)
  Utils.processEdges(graphDisplayData.edges, { poly: 50 })

  return (
    <React.Fragment>
      <Title>Person List</Title>
      <SearchBar
        classes={classes}
        callback={(event, value) => addSeedNode(value.id)}
        apiHost={API_HOST}
      />
      
      <div>
        <Title>Graph</Title>
        <Paper>
          <Grid
            component={Box}
            container
            justifyContent="flex-end"
            display="block"
            id="GetNextButton"
          >
            <Button variant="contained" onClick={toggleVisibility}>
              Get Next Ad and Next Evidence Nodes
            </Button>
          </Grid>
          {/* concentric */}
          <Graphin data={graphDisplayData} layout={{ type: 'concentric' }}>
            <ClickSelect
              onClick={(e) => addSeedNode(e.item._cfg.id)}
            ></ClickSelect>
            <NodeTooltip />
          </Graphin>
          <div id="AcceptAndReject" style={{ display: 'none' }}>
            <Grid container justifyContent="flex-end">
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
      <div style={{ padding:20 }}>
        <Grid>
          <Card variant="outlined">
            <CardContent>
              <Typography>
                Hello
              </Typography>
              <Button
                onClick={()=>console.log("clicked 1")}
              >
                Click here!
              </Button>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography>
                Hello
              </Typography>
              <Button
                onClick={()=>console.log("clicked 2")}
              >
                Click here!
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </div>
    </React.Fragment>
    
  )
}

export default withStyles(styles)(GraphDisplay)

// TODO: This needs to be a dictionary
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
    color = 'gray'
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
    node.style.keyshape = {
      ...node.style.keyshape,
      lineWidth: 5,
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
