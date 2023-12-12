import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost/api/graphql',
  documents: ['./src/graphql/**/*.graphql'],
  generates: {
    './src/graphql/graphql-types.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-urql'],
      config: {
        withHooks: true,
      },
      hooks: {
        afterOneFileWrite: ['prettier --write'],
      },
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
