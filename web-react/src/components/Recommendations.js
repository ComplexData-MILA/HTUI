import React from 'react'
import {
    Box
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import ModelSelect from './ModelSelect.js'

export default function Recommendations(props) {
  const {callback} = props
    return (
        <React.Fragment>
        <Box sx={{ height: 400, bgcolor: 'background.paper' }}>
          <DataGrid 
            onCellClick={callback}
            hideFooter 
            columns={[{ field: 'name' }]}
            rows={[
              { id: 1, name: 'React' },
              { id: 2, name: 'MUI' },
            ]}
            components={{
              Toolbar: ModelSelect,
            }}
          />
        </Box>
      </React.Fragment>
    )
}