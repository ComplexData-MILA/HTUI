import React from 'react'
import {
    Card,
    CardContent,
    Button,
    Grid,
    Typography,
} from '@material-ui/core'

export default function Cards(props) {
    return (
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
    )
}