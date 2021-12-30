import React, { useState, useRef } from 'react'

import clsx from 'clsx'
import { makeStyles } from '@mui/styles'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
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
const appBarHeight = 80

const theme = createTheme()

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  }),
);

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
        height: `calc(100vh - ${appBarHeight}px)`,
        width: '100%',
        overflow: 'auto',
        paddingTop: 20,
        paddingBottom: 20,
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
        ...theme.mixins.toolbar,
      },
      mainShift: {
        height: `calc(100vh - ${appBarHeight}px)`,
        width: `calc(100vw - ${drawerWidth}px)`,
        overflow: 'auto',
        paddingTop: 20,
        paddingBottom: 20,
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
        ...theme.mixins.toolbar,
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
        // positive: 'relative',
        zIndex: theme.zIndex.drawer + 1,
        height: appBarHeight,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
      drawerPadding: {
        marginTop: 80,
      }, 
      contentWrapper: {
        height: '100vh',
        overflow: 'auto',
        paddingBottom: 20,
        width: '100%',
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        })
      },
      contentShift: {
        width: `calc(100% - ${drawerWidth})`, 
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        })
      },
}))

const queryClient = new QueryClient()

function NewAppContent() {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)
    const handleDrawerOpen = () => {
      setOpen(true)
      console.log(open)
    }
    const handleDrawerClose = () => {
      setOpen(false)
      console.log(open)
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
      // console.log(height)
    }, []);

    return (
        <StyledEngineProvider injectFirst>
            <QueryClientProvider client={queryClient}>
                <div>
                    <CssBaseline />
                    <AppBar
                        position="sticky"
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
                      // className={clsx(classes.main, open && classes.mainShift)}
                    >
                      <GraphDisplay
                        height={appBarHeight}
                        open={open}
                        classes={classes}
                        subgraphNodes={subgraphNodes}
                        addSeedNode={addSeedNode}
                      ></GraphDisplay>
                      <Fab
                        onClick={handleDrawerOpen}
                        className={clsx(
                          classes.recButton,
                          open && classes.recButtonHidden
                        )}
                        variant="extended"
                      >
                        Recommend Nodes
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
                              callback={addSeedNode}
                              apiHost={API_HOST}
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