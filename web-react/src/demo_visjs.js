import React from "react";
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";

// import "./styles.css";
// need to import the vis network css in order to show tooltip
// import "./network.css";

function App() {
  const graph = {
    "numNodes": 9,
    "nodes": [
        {
            "nhs_no": "632-68-0917",
            "surname": "Rice",
            "name": "Anne",
            "label": "Person",
            "id": "431"
        },
        {
            "nhs_no": "820-53-4909",
            "surname": "Foster",
            "name": "Cynthia",
            "label": "Person",
            "id": "411"
        },
        {
            "nhs_no": "641-52-2437",
            "surname": "Fox",
            "name": "Johnny",
            "label": "Person",
            "id": "433"
        },
        {
            "address": "182 Uttley Street",
            "latitude": 53.602362,
            "postcode": "OL11 4PB",
            "label": "Location",
            "id": "432",
            "longitude": -2.177961
        },
        {
            "nhs_no": "766-98-1818",
            "surname": "Chavez",
            "name": "Carlos",
            "label": "Person",
            "id": "143"
        },
        {
            "nhs_no": "240-77-5251",
            "surname": "Moreno",
            "name": "Andrea",
            "label": "Person",
            "id": "1092"
        },
        {
            "email_address": "cfoster7g@springer.com",
            "label": "Email",
            "id": "414"
        },
        {
            "label": "Phone",
            "id": "413",
            "phoneNo": "2-(716)295-6678"
        },
        {
            "address": "154 Bread Street",
            "latitude": 53.466442,
            "postcode": "M18 8QF",
            "label": "Location",
            "id": "412",
            "longitude": -2.164075
        }
    ],
    "numEdges": 11,
    "edges": [
        {
            "from": "431",
            "to": "432",
            "label": "CURRENT_ADDRESS"
        },
        {
            "from": "411",
            "to": "143",
            "label": "KNOWS_PHONE"
        },
        {
            "from": "411",
            "to": "143",
            "label": "KNOWS"
        },
        {
            "from": "411",
            "to": "414",
            "label": "HAS_EMAIL"
        },
        {
            "from": "411",
            "to": "413",
            "label": "HAS_PHONE"
        },
        {
            "from": "411",
            "to": "412",
            "label": "CURRENT_ADDRESS"
        },
        {
            "from": "433",
            "to": "431",
            "label": "KNOWS"
        },
        {
            "from": "433",
            "to": "431",
            "label": "KNOWS_LW"
        },
        {
            "from": "433",
            "to": "432",
            "label": "CURRENT_ADDRESS"
        },
        {
            "from": "1092",
            "to": "411",
            "label": "KNOWS_SN"
        },
        {
            "from": "1092",
            "to": "411",
            "label": "KNOWS"
        }
    ]
}

  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: "#000000"
    },
    height: "500px"
  };

  const events = {
    select: function(event) {
      var { nodes, edges } = event;
    }
  };
  return (
    <Graph
      graph={graph}
      options={options}
      events={events}
      getNetwork={network => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
      }}
    />
  );
}

export default App;