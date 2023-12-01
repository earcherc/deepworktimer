const headers = {
  accept: 'application/json',
  'x-api-key': `${process.env.API_KEY}`,
};

export const fetchAggregatedProfile = (jwtToken: string) => {
  return fetch(`http://localhost:8002/aggregator/aggregated-profile`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${jwtToken}`,
    },
  });
};
