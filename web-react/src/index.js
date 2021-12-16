import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { theme, default as App } from './App'
import { ThemeProvider } from '@mui/material/styles'

import registerServiceWorker from './registerServiceWorker'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI || '/graphql',
  cache: new InMemoryCache(),
})

// const theme = createTheme()

const Main = () => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}><App /></ThemeProvider>
  </ApolloProvider>
)

ReactDOM.render(<Main />, document.getElementById('root'))
registerServiceWorker()
