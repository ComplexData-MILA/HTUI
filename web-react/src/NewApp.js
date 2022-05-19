import React, { useState, useRef } from 'react'
import { useQuery } from "react-query"
import clsx from 'clsx'
import { makeStyles } from '@mui/styles'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import { Menu } from '@mui/icons-material'
import { StyledEngineProvider } from '@mui/material/styles'
import { withStyles } from '@mui/styles'

import SearchBar from './components/Search'
// import Recommendations from './components/Recommendations'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import GraphDisplay from './components/Graph'
import CustomizedDialog from './components/RecDialog'
import NodeInfoTable from './components/NodeInfoTable'

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

const drawerWidth = 300
const appBarHeight = 80

const theme = createTheme({
  palette: {
    primary: {
      main: '#81C2FF',
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
        position: 'absolute',
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
        // height: '100vh',
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
          fill: '#bdbdbd',
      },
      root: {
          color: theme.palette.secondary.contrastText,
      },
      // inputLabel: {
      //   color: '#bdbdbd',
      //   '&:hover fieldset': {
      //     color: '#fff',
      //   },
      //   '&.Mui-focused':{
      //     color: '#fff',
      //   }
      // },
}))

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#fafafa',
  },
  // '& .MuiInputLabel-root':{
  //   color: '#bdbdbd'
  // },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#fafafa',
  },
  // '& .MuiInputBase-input': {
  //   // '&.Mui-focused': {
  //   //   color: '#fafafa'
  //   // }
  //   color: '#fafafa'
  // },
  '& .MuiOutlinedInput-root': {
    // '& fieldset': {
    //   borderColor: '#bdbdbd',
    // },
    '&:hover fieldset': {
      border: '1px solid #fafafa',
      color: '#fafafa'
    },
    '&.Mui-focused fieldset': {
      border: '2px solid #fafafa',
      color: '#fafafa'
      // '& .MuiInputBase-input': {
      //   color: '#fafafa'
      // },
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

    // hook for the Get Recommendation floating options button
    const [openOptions, setOpenOptions] = useState(false);

    const [subgraphNodes, setNodes] = useState([])
    const addSeedNode = (id) => {
        console.log(
        `Adding node ${id} to the visualization with existing nodes ${subgraphNodes}.`
        )
        setNodes([...subgraphNodes, parseInt(id)])
        setOpenOptions(false);
    }

    const addMultSeedNodes = (ids) => {
      console.log(
        `Adding MULTIPLE nodes ${ids} to the visualization with existing nodes ${subgraphNodes}.`
      )
      setNodes(subgraphNodes.concat(ids))
      setOpenOptions(false);
    }

    const [height, setHeight] = React.useState(0);

    const measuredRef = React.useCallback(node => {
      if (node !== null) {
        setHeight(node.getBoundingClientRect().height);
      }
      // console.log(height)
    }, []);

    // rec dialog open/close hooks and functions, passed in as prop to CustomizedDialog
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleClickOpen = () => {
      setOpenDialog(true);
    };
    const handleClickClose = () => {
      setOpenDialog(false);
    };


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
                    {/* {openOptions && <Grid container spacing={2} 
                            columns={8} 
                            display="flex" 
                            alignItems="center"
                            justifyContent="center"
                            marginTop={'0px'}
                      >
                          <Button
                            style={{
                              backgroundColor: theme.palette.secondary.main,
                              color: theme.palette.secondary.contrastText,
                            }}
                            onClick={() => {
                              handleClickOpen()
                            }}
                          >
                            Get Recommendations
                          </Button>
                      </Grid>
                    }      */}
                    <main>
                      {/* <GraphDisplay
                        open={open}
                        classes={classes}
                        subgraphNodes={subgraphNodes}
                        addSeedNode={addSeedNode}
                        handleOpenOptions={setOpenOptions}
                      ></GraphDisplay> */}
                      {/* <Fab className={classes.recButton}> */}
                        {/* <NodeInfoTable className={classes.recButton}></NodeInfoTable> */}
                      {/* </Fab> */}
                      <div>
                        <div
                          style={{
                            height: 0,
                            // backgroundColor: "lightblue",
                            position: "relative",
                            top: 0,
                            zIndex: 1
                          }}
                        >
                          {/* zIndex - I have a middle zIndex value */}
                          <GraphDisplay
                            open={open}
                            classes={classes}
                            subgraphNodes={subgraphNodes}
                            addSeedNode={addSeedNode}
                            handleOpenOptions={setOpenOptions}
                          ></GraphDisplay>
                        </div>
                        <div
                          style={{
                            height: 0,
                            // backgroundColor: "yellow",
                            position: "relative",
                            top: 10,
                            left: 10,
                            zIndex: 3
                          }}
                        >
                          {/* zIndex - I have the highest */}
                          <NodeInfoTable 
                            className={classes.recButton}
                            apiHost={API_HOST}
                          ></NodeInfoTable>
                        </div>
                        <div
                          style={{
                            height: 0,
                            backgroundColor: "lightgreen",
                            position: "relative",
                            top: 0,
                            zIndex: 2
                          }}
                        >
                          {openOptions && <Grid container spacing={2} 
                            columns={8} 
                            display="flex" 
                            alignItems="center"
                            justifyContent="center"
                            marginTop={'0px'}
                          >
                              <Button
                                style={{
                                  backgroundColor: theme.palette.secondary.main,
                                  color: theme.palette.secondary.contrastText,
                                }}
                                onClick={() => {
                                  handleClickOpen()
                                }}
                              >
                                Get Recommendations
                              </Button>
                          </Grid>
                        } 
                        </div>
                      </div>
                    </main>
                    <CustomizedDialog 
                      openDialog={openDialog}
                      handleClickClose={handleClickClose}
                      handleClickOpen={handleClickOpen}
                      callback={addMultSeedNodes}
                      apiHost={API_HOST}
                      classes={classes}
                      theme={theme}
                      seedNodes={subgraphNodes}
                    />
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