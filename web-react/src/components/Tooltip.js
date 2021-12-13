import React from 'react'
import { Tooltip } from '@antv/graphin-components'
import '@antv/graphin/dist/index.css' // may be removed in the future by antv
import {
    Card,
    CardContent,
    Typography,
} from '@mui/material'

export default function NodeTooltip(props) {
    return (
        <Tooltip bindType="node" placement="top">
            <Tooltip.Node>
                {(node) => {
                    return (
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
                    )
                }}
            </Tooltip.Node>
        </Tooltip>
    )
}