import React from 'react'
import Graphin, { Utils } from '@antv/graphin'

import '@antv/graphin/dist/index.css'

const data = Utils.mock(13).circle().graphin()

export default function GraphDisplay() {
  console.log(data)
  return (
    <React.Fragment>
      <div className="App">
        <Graphin data={data} layout={{ name: 'concentric' }} />
      </div>
    </React.Fragment>
  )
}
