import React, { useState } from 'react'

import clsx from 'clsx'
import { makeStyles } from '@mui/styles'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/material/styles'
import { withStyles } from '@mui/styles'

import SearchBar from './components/Search'
import Recommendations from './components/Recommendations'
import GraphDisplay from './components/Graph'

import {
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Box,
    Container,
    Fab,
} from '@mui/material'
import {
    Menu as MenuIcon,
} from '@mui/icons-material'

import {
    QueryClient,
    QueryClientProvider,
} from 'react-query'

const API_HOST = process.env.REACT_APP_API_HOST || 'http://localhost:8000';

const drawerWidth = 240

const theme = createTheme()

const useStyles = makeStyles((theme) => ({
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      minWidth: 300,
    },
    root: {
        display: 'flex',
      },
      toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
      },
      toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
      },
      appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
      appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      menuButton: {
        marginRight: 36,
      },
      menuButtonHidden: {
        display: 'none',
      },
      title: {
        flexGrow: 1,
      },
      drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      },
      appBarSpacer: theme.mixins.toolbar,
      content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        paddingBottom: 20,
      },
      container: {
        // paddingTop: theme.spacing(4),
        borderBottom: 2,
      },
      paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
      },
      fixedHeight: {
        height: 240,
      },
      navLink: {
        textDecoration: 'none',
        color: 'inherit',
      },
      appBarImage: {
        maxHeight: '75px',
        paddingRight: '20px',
      },
}))

const queryClient = new QueryClient()

function NewAppContent() {
    const classes = useStyles()

    const [subgraphNodes, setNodes] = useState([])
    const addSeedNode = (id) => {
        console.log(
        `Adding node ${id} to the visualization with existing nodes ${subgraphNodes}.`
        )
        setNodes([...subgraphNodes, parseInt(id)])
    }

    return (
        <StyledEngineProvider injectFirst>
            <QueryClientProvider client={queryClient}>
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar
                        position="absolute"
                        className={clsx(classes.appBar)}
                    >
                        <Toolbar className={classes.toolbar}>
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                noWrap
                                className={classes.title}
                            >
                                SusGraph
                            </Typography>
                            <SearchBar
                                classes={classes}
                                callback={(event, value) => addSeedNode(value.id)}
                                apiHost={API_HOST}
                            />
                        </Toolbar>
                    </AppBar>
                    <main className={classes.content}>
                        <GraphDisplay
                            subgraphNodes={subgraphNodes}
                            addSeedNode={addSeedNode}
                        ></GraphDisplay>
                        <Fab>
                          <MenuIcon />
                        </Fab>
                    </main>
                </div>
            </QueryClientProvider>
        </StyledEngineProvider>
    )
}

export default function NewApp() {
    return (
        <ThemeProvider theme={theme}>
            <NewAppContent />
        </ThemeProvider>
    )
}