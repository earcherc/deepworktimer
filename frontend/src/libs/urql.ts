import { ClientOptions, cacheExchange, createClient, fetchExchange } from 'urql';

const clientOps: ClientOptions = {
  url: 'http://localhost/api/graphql',
  requestPolicy: 'cache-and-network',
  exchanges: [cacheExchange, fetchExchange],
};

const client = createClient(clientOps);

export default client;
