import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { getSeedMutations } from './seed-mutations'

dotenv.config()

const {
  GRAPHQL_SERVER_HOST: host,
  GRAPHQL_SERVER_PORT: port,
  GRAPHQL_SERVER_PATH: path,
  GRAPHQL_URI: full,
} = process.env

console.log(full);

let uri = full || `http://${host}:${port}${path}`

console.log(uri);

const client = new ApolloClient({
  link: new HttpLink({ uri, fetch }),
  cache: new InMemoryCache(),
})

const runMutations = async () => {
  const mutations = await getSeedMutations()

  return Promise.all(
    mutations.map(({ mutation, variables }) => {
      return client
        .mutate({
          mutation,
          variables,
        })
        .catch((e) => {
          throw new Error(e)
        })
    })
  )
}

runMutations()
  .then(() => {
    console.log('Database seeded!')
  })
  .catch((e) => console.error(e))
