import { ApolloClient, InMemoryCache } from '@apollo/client'
import createUploadHttpLink from 'apollo-upload-client/createUploadLink.mjs'
import { SERVER_URL } from '../constants'

const httpLink = createUploadHttpLink({
  uri: SERVER_URL,
  credentials: 'include',
  headers: {
    'apollo-require-preflight': 'true',
  },
})

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})
