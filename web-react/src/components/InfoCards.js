import React from 'react'
import {
    Card,
    CardActions,
    CardContent,
    Button,
    Typography,
    Stack
} from '@mui/material'
import { grey } from '@mui/material/colors';

export default function InfoCards(props) {
    const {callback, infoData} = props
    return (
        infoData.map(function(obj){
            const id = obj.id
            const label = obj.labels[0]
            const properties = Object.keys(obj.properties)
            var str = ""
            for (let [key, value] of Object.entries(obj.properties)) {
                str += key + ": " + value + ",\n"
            }
            
            return(
            <Card variant="outlined" sx={{ minWidth: 275 }} bgcolor={grey[500]} key={id}>
                <CardContent>
                    <Typography variant="h5" component="div" sx={{color: "red"}}>
                        {label}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} sx={{color: "white"}}>
                        {id}
                    </Typography>
                    <Typography variant="body2" sx={{color: "white"}}>
                        Properties:
                        <br />
                        {str}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button id={parseInt(id)} size="small" sx={{color: "blue"}} onClick={(event)=>callback(event.target.id)}>Add Node</Button>
                </CardActions>
            </Card>
            )
        })
    )
}