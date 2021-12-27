import React, { useState, useRef } from 'react'

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
    Drawer,
    IconButton,
    Divider,
} from '@mui/material'
import {
    Menu as MenuIcon,
    ChevronRight,
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
      content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        paddingBottom: 20,
      },
      recButton: {
        position: 'fixed',
        top: 100,
        right: theme.spacing(2)
      },
      recButtonHidden: {
        hidden: 'none',
      },
      main: {
        height: '100vh',
        overflow: 'auto',
        paddingBottom: 20,
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
      },
      mainShift: {
        height: '100vh',
        overflow: 'auto',
        paddingBottom: 20,
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
      },
      drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        // padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
        // top: 80,
      },
      title: {
        flexGrow: 1,
      },
      appBar: {
        positive: 'relative',
        zIndex: theme.zIndex.drawer + 1,
        // height: 36,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
      drawerPadding: {
        marginTop: 80,
      }
}))

const queryClient = new QueryClient()

function NewAppContent() {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)
    const handleDrawerOpen = () => {
      console.log('opened')
      setOpen(true)
    }
    const handleDrawerClose = () => {
      setOpen(false)
    }

    const [subgraphNodes, setNodes] = useState([])
    const addSeedNode = (id) => {
        console.log(
        `Adding node ${id} to the visualization with existing nodes ${subgraphNodes}.`
        )
        setNodes([...subgraphNodes, parseInt(id)])
    }

    const [height, setHeight] = React.useState(0);

    const measuredRef = React.useCallback(node => {
      if (node !== null) {
        setHeight(node.getBoundingClientRect().height);
      }
    }, []);
  
    const placeHolder = (event) => {
      console.log(event.id)
    }

    return (
        <StyledEngineProvider injectFirst>
            <QueryClientProvider client={queryClient}>
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar
                        position="absolute"
                        className={classes.appBar}
                        ref={measuredRef}
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
                    <main
                      className={clsx(classes.main, open && classes.mainShift)}
                    >
                        <GraphDisplay
                            subgraphNodes={subgraphNodes}
                            addSeedNode={addSeedNode}
                        ></GraphDisplay>
                        <Fab
                          onClick={handleDrawerOpen}
                          className={clsx(
                            classes.recButton,
                            open && classes.recButtonHidden
                          )}
                        >
                          <MenuIcon />
                        </Fab>
                        <div>
                          <Drawer
                            // position="relative"
                            sx={{
                              width: drawerWidth,
                              flexShrink: 0,
                              '& .MuiDrawer-paper': {
                                width: drawerWidth,
                              },
                              // top: 200,
                            }}
                            variant="persistent"
                            anchor="right"
                            open={open}
                          >
                            <Box className={classes.drawerPadding}>
                              <Toolbar className={classes.drawerHeader}>
                                <IconButton onClick={handleDrawerClose}>
                                  <ChevronRight />
                                </IconButton>
                              </Toolbar>
                              <Divider />
                              <Recommendations
                                callback={(event) => placeHolder(event)}
                              />
                            </Box>
                          </Drawer>
                        </div>
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