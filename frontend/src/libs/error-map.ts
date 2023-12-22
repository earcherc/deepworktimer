import { CombinedError } from 'urql';

export function mapErrors(combinedError: CombinedError): Record<string, string> {
  let errorMap: Record<string, string> = {};

  // Handle network error
  if (combinedError.networkError) {
    errorMap.networkError = combinedError.networkError.message;
  }

  // Handle GraphQL errors
  combinedError.graphQLErrors.forEach((error) => {
    const field = error?.extensions?.field;
    if (typeof field === 'string' && error.message) {
      errorMap[field] = error.message;
    } else {
      // If no field is specified, or for any non-field specific error, we can use a generic key
      errorMap.general = error.message;
    }
  });

  return errorMap;
}
