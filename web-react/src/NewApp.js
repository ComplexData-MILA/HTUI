import React, { useState, useRef } from 'react'

import clsx from 'clsx'
import { makeStyles } from '@mui/styles'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import { Menu } from '@mui/icons-material'
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
    TextField,
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
      main: '#4C90CF',
    },
    secondary: {
      main: '#235481',
      contrastText: '#fff',
    },
    highlight: {
      main: '#76078c',
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
        bottom: theme.spacing(3),
        right: theme.spacing(3),
        background: theme.palette.highlight.main,
        color: theme.palette.highlight.contrastText,
      },
      recButtonHidden: {
        hidden: 'none',
      },
      drawerFooter: {
        position: 'relative',
        alignContent: 'flex-end',
        // padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        bottom: theme.spacing(3),
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
      drawerPadding: {
        marginTop: appBarHeight + 10,
        height: '100vh'
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

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#fafafa',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#fafafa',
  },
  // '& .MuiInputLabel-root': {
  //   color: '#bdbdbd',
  // },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#bdbdbd',
    },
    '&:hover fieldset': {
      borderColor: '#fafafa',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#fafafa',
    },
  },
});

const NewFab = styled(Fab)(({ theme }) => ({
  // '& .MuiFab-root': {
  //   background: theme.palette.highlight.main,
  // },
  '&:hover': {
    background: '#963484',
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
                                Custom={CssTextField}
                                classes={classes}
                                callback={(event, value) => addSeedNode(value.id)}
                                apiHost={API_HOST}
                            />
                        </Toolbar>
                    </AppBar>
                    <main>
                      <GraphDisplay
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
                        variant="circular"
                      >
                        <Menu></Menu>
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
                            <Divider />
                            <Recommendations
                              callback={addSeedNode}
                              apiHost={API_HOST}
                              classes={classes}
                              theme={theme}
                              seedNodes={subgraphNodes}
                            />
                          </Box>
                          <div className={classes.drawerFooter}>
                            <ColorButton onClick={handleDrawerClose} sx={{ml: '5px'}}>
                              <ChevronRight />
                            </ColorButton>
                          </div>
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