import React, { useState, useRef } from 'react'

import clsx from 'clsx'
import { makeStyles } from '@mui/styles'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import { green, purple } from '@mui/material/colors'
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

const theme = createTheme({
  palette: {
    primary: {
      main: '#55C7EB',
    },
    secondary: {
      main: '#235481',
      contrastText: '#fff',
    },
    highlight: {
      main: '#955e42',
      contrastText: '#fff'
    },
    white: {
      main: '#fff',
    },
    typography: {
      fontFamily: 'Montserrat',
    },
  },
});

const useStyles = makeStyles((theme) => ({
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      minWidth: 300,
    },
      toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
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
        right: theme.spacing(2),
        background: theme.palette.highlight.main,
        color: theme.palette.highlight.contrastText,
      },
      recButtonHidden: {
        hidden: 'none',
      },
      drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        // padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
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
        marginTop: appBarHeight,
      }, 
      paper: {
        background: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        border: 0,
      },
      icon: {
          fill: theme.palette.secondary.contrastText,
      },
      root: {
          color: theme.palette.secondary.contrastText,
      },
}))

const NewFab = styled(Fab)(({ theme }) => ({
  // '& .MuiFab-root': {
  //   background: theme.palette.highlight.main,
  // },
  '&:hover': {
    background: '#6d4c41',
  },
}));

const ColorButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
}));


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
                    <main>
                      <GraphDisplay
                        height={appBarHeight}
                        open={open}
                        classes={classes}
                        subgraphNodes={subgraphNodes}
                        addSeedNode={addSeedNode}
                      ></GraphDisplay>
                      <NewFab
                        onClick={handleDrawerOpen}
                        className={clsx(
                          classes.recButton,
                          open && classes.recButtonHidden
                        )}
                        variant="extended"
                      >
                        Recommend Nodes
                      </NewFab>
                      <div>
                        <Drawer
                          classes={{ paper: classes.paper }}
                          sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                              width: drawerWidth,
                            },
                          }}
                          variant="persistent"
                          anchor="right"
                          open={open}
                        >
                          <Box className={classes.drawerPadding}>
                            <div className={classes.drawerHeader}>
                              <ColorButton onClick={handleDrawerClose} sx={{ml: '5px'}}>
                                <ChevronRight />
                              </ColorButton>
                            </div>
                            <Divider />
                            <Recommendations
                              callback={addSeedNode}
                              apiHost={API_HOST}
                              classes={classes}
                              theme={theme}
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