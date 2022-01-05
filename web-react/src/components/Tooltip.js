import React from 'react'
import Graphin, { GraphinContext, Utils } from '@antv/graphin';
import { Tooltip } from '@antv/graphin-components'
import '@antv/graphin/dist/index.css' // may be removed in the future by antv
import {
    Card,
    CardContent,
    Typography,
} from '@mui/material'

const CustomTooltip = () => {
    const { tooltip } = React.useContext(GraphinContext);
    const context = tooltip.node;
    const { item } = context;
    const node = item && item.getModel();
  
    return (
      <div>
        <Card variant="outlined">
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        {node.label}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {node.id}
                    </Typography>
                </CardContent>
            </Card>
      </div>
    );
  };

export default function NodeTooltip(props) {
    return (
        <Tooltip bindType="node" placement="bottom">
            <CustomTooltip />
        </Tooltip>
    )
}