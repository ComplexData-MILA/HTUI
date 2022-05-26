import React, { useState, useEffect, createRef, useRef } from 'react'
import { useQuery, gql } from '@apollo/client'
import Graphin, { Utils, Behaviors, GraphinContext } from '@antv/graphin'
import PersonIcon from '../img/person_black_24dp.svg'
import EmailIcon from '../img/alternate_email_black_24dp.svg'
import VehicleIcon from '../img/directions_car_black_24dp.svg'
import AddressIcon from '../img/home_black_24dp.svg'
import PhoneIcon from '../img/phone_black_24dp.svg'
import PhoneCallIcon from '../img/phone_in_talk_black_24dp.svg'
import AreaIcon from '../img/place_black_24dp.svg'
import {GppMaybeIcon as CrimeIcon} from '@mui/icons-material/GppMaybe';
import '@antv/graphin/dist/index.css' // may be removed in the future by antv
import { withStyles } from '@mui/styles'
import clsx from 'clsx'
import NodeTooltip from './Tooltip'
import { Box, Container } from '@mui/material'
import classNames from 'classnames'
import Graph from "react-graph-vis"; // new graph visualization
import NodeInfoTable from './NodeInfoTable'

const API_HOST = process.env.REACT_APP_API_HOST || 'http://localhost:8000';
console.log(`API hosted at ${API_HOST}.`)

//written in JSS not CSS
const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300,
  },
})

function GraphDisplay(props) {
  // declare useState hooks
  const { open, 
          classes, 
          subgraphNodes, 
          addSeedNode, 
          handleOpenOptions, 
          setCurrSelectedNode,
          getLabel
         } = props
  // const [subgraphNodes, setNodes] = useState([])
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [graph, setGraph] = useState({nodes: [], edges: []})
  // const canvasRef = useRef()

  // const { graph: graphContext } = React.useContext(GraphinContext)
  // console.log(graphContext)
  // const width = useContainerWidth(canvasRef, graphContext)

  useEffect(() => {
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ node_ids: subgraphNodes })
      };
      fetch(`${API_HOST}/graph/pole/subgraph`, requestOptions)
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
    addNodeStyles(node, getLabel, subgraphNodes)
  })
  graphDisplayData.edges.forEach(addEdgeStyles)
  Utils.processEdges(graphDisplayData.edges, { poly: 50 })

  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: "#000000",
      font: {
        "align": 'top'
      },
      length: 200
    },
    groups: {
      Person: {
        color: '#40e0d0'
      },
      Email: {
        color: '#FF7F7F'
      },
      Location: {
        color: '#90EE90'
      },
      Phone: {
        color: '#CBC3E3'
      },
      Area: {
        color: 'pink'
      },
      Crime: {
        color: '#ADD8E6'
      },
      PostCode: {
        color: '#FFB6C1'
      },
      PhoneCall: {
        color: '#CBC3E3'
      },
      Vehicle: {
        color: '#D3D3D3'
      },
      Officer: {
        color: '#FFD580'
      },
    },
    // height: "500px"
  };

  const events = {
    selectNode: function(event) {
      var { nodes, edges } = event;
      // addSeedNode(nodes[0])
      // if (openDialog) {
      //   handleClickClose();
      // } else {
      //   handleClickOpen();
      // }
      handleOpenOptions(true);
      setCurrSelectedNode(nodes)
    }
  };

  return (
    <React.Fragment>
      <Box 
        className={classes.main}
      > 
        <Graph
          graph={graphDisplayData}
          options={options}
          events={events}
          getNetwork={network => {
            //  if you want access to vis.js network api you can set the state in a parent component using this property
          }}
        >
        </Graph>
        {/* <NodeInfoTable className={classes.recButton}></NodeInfoTable> */}
      </Box>
      
    </React.Fragment>
  )
}

// export default withStyles(styles)(GraphDisplay)
export default GraphDisplay

// TODO: This needs to be a dictionary
function addNodeStyles(node, getLabel, selectedNodes) {
  // adding styles
  let labelValue = ''
  node['group'] = node.labels[[0]];
  node.label = getLabel(node.labels[0], node.properties);

  /* start Graphin code, left here for reference */
  // node.style = {
  //   label: {
  //     value: labelValue,
  //   },
  //   icon: {
  //     type: 'image',
  //     value: iconValue,
  //     size: [20, 20],
  //   },
  //   keyshape: {
  //     fill: color,
  //     stroke: color,
  //     fillOpacity: 0.2,
  //   },
  // }

  // add highlight to seed nodes
  // if (selectedNodes.includes(parseInt(node.id))) {
  //   node.style.keyshape = {
  //     ...node.style.keyshape,
  //     lineWidth: 5,
  //   }
  // }
  /* end Graphin code */
  
  /* an attempt to get the icons to work with visjs */
  // node['icon'] = {
  //   face: 'Font Awesome 5 Free',
  //   code: '\uf007',
  //   weight: "bold"
  // }
}

function addEdgeStyles(edge) {
  edge.style = {
    label: {
      value: edge.label,
    },
  }
}
