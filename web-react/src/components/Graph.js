import React, { useEffect } from 'react'

import Graphin from '@antv/graphin'

// const walk = (node, callback) => {
//   callback(node)
//   if (node.children && node.children.length !== 0) {
//     node.children.forEach((n) => {
//       walk(n, callback)
//     })
//   }
// }

function addStyles(node) {
  node.style = {
    label: {
      value: node.name + ' ' + node.surname,
    },
  }
}

const GraphDisplay = () => {
  const [state, setState] = React.useState({
    data: null,
  })
  useEffect(
    () =>
      // eslint-disable-next-line no-undef
      fetch(
        // 'https://gw.alipayobjects.com/os/antvdemo/assets/data/algorithm-category.json'
        'Amanda_Alexander.json'
      )
        .then((res) => res.json())
        .then((res) => {
          console.log('data', res)
          res.nodes.forEach(addStyles)
          setState({
            data: res,
          })
        }),
    []
  )

  const { data } = state
  console.log(data)

  // data.node = data.node.forEach(addStyles)

  return (
    <div>
      {data && <Graphin data={data} layout={{ type: 'concentric' }}></Graphin>}
    </div>
  )
}

export default GraphDisplay
