import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
// import App from './App'
import NewApp from './NewApp'
// import App from './demo_visjs'
// import { ThemeProvider } from '@mui/material/styles'

import registerServiceWorker from './registerServiceWorker'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI || '/graphql',
  cache: new InMemoryCache(),
})

// const theme = createTheme()

const Main = () => (
  <ApolloProvider client={client}>
    {/* <App /> */}
    <NewApp />
  </ApolloProvider>
)

ReactDOM.render(<Main />, document.getElementById('root'))
registerServiceWorker()
