import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: ['./src/app/graphql/**/*.graphql'],
  generates: {
    './src/app/graphql/generated/output.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular'],
    },
  },
  ignoreNoDocuments: true,
};
export default config;
