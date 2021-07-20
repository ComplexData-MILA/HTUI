import React from 'react'
// import React, { useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
// import Graphin from '@antv/graphin'
import Graphin, { Utils } from '@antv/graphin'
import '@antv/graphin/dist/index.css'
import { withStyles, TextField } from '@material-ui/core'
import Title from './Title'

// const walk = (node, callback) => {
//   callback(node)
//   if (node.children && node.children.length !== 0) {
//     node.children.forEach((n) => {
//       walk(n, callback)
//     })
//   }
// }

const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300,
  },
})

const GET_PERSON = gql`
  query peoplePaginateQuery($filter: PersonWhere) {
    people(where: $filter) {
      name
      surname
    }
  }
`

const GET_FILE = gql`
  query fileQuery($nameInput: String, $surnameInput: String) {
    jsonFile(name: $nameInput, surname: $surnameInput)
  }
`

function GraphDisplay(props) {
  // first get the person's name we want to filter with
  const { classes } = props
  const [filterState, setFilterState] = React.useState({ nameFilter: '' })

  const getFilter = () => {
    return filterState.nameFilter.length > 0
      ? {
          OR: [
            { name_CONTAINS: filterState.nameFilter },
            { surname_CONTAINS: filterState.nameFilter },
          ],
        }
      : {}
  }

  // can't use below otherwise will render different order of hooks
  // if (errorPerson) return <p>Error with GET_PERSON query</p>
  // if (loadingPerson) return <p>Loading GET_PERSON query</p>

  const defaultFirstName = 'Amanda'
  const defaultLastName = 'Alexander'

  const {
    loading: loadingPerson,
    data: dataPerson,
    error: errorPerson,
  } = useQuery(GET_PERSON, { variables: { filter: getFilter() } })

  console.log(dataPerson)

  const { loading, data, error } = useQuery(GET_FILE, {
    variables: {
      nameInput: dataPerson
        ? dataPerson[0]
          ? dataPerson[0].name
          : defaultFirstName
        : defaultFirstName,
      surnameInput: dataPerson
        ? dataPerson[0]
          ? dataPerson[0].surname
          : defaultLastName
        : defaultLastName,
    },
  })

  if (errorPerson) return <p>Error Person</p>
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>
  if (loadingPerson) return <p>Loading Person</p>

  const handleFilterChange = (filterName) => (event) => {
    const val = event.target.value

    setFilterState((oldFilterState) => ({
      ...oldFilterState,
      [filterName]: val,
    }))
    console.log(val)
  }

  let graphData = JSON.parse(data.jsonFile)
  graphData.nodes.forEach(addNodeStyles)
  graphData.edges.forEach(addEdgeStyles)
  Utils.processEdges(graphData.edges, { poly: 50 })

  return (
    <React.Fragment>
      <Title>Person List</Title>
      <TextField
        id="search"
        label="Person Name Contains"
        className={classes.textField}
        value={filterState.nameFilter}
        onChange={handleFilterChange('nameFilter')}
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          className: classes.input,
        }}
      />
      <div>
        <Title>Graph</Title>
        <div className="App">
          <Graphin data={graphData} layout={{ type: 'concentric' }}></Graphin>
        </div>
      </div>
    </React.Fragment>
  )
}

export default withStyles(styles)(GraphDisplay)

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
