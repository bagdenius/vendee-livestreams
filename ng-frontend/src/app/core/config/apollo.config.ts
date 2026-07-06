import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { environment } from '../../../environments';

export function getApolloConfig(): ApolloClient.Options {
  return {
    link: new HttpLink({
      uri: environment.serverUrl,
      credentials: 'include',
    }),
    cache: new InMemoryCache(),
  };
}
