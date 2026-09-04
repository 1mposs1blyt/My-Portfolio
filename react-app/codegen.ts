import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // Путь к файлу схемы бэкенда (или URL запущенного бэкенда http://localhost:3333/graphql)
  schema:"http://localhost:3333/graphql", //'../nestjs-app/src/schema.gql', 
  documents: ['src/**/*.tsx', 'src/**/*.ts','src/api/*.ts'], // Где искать ваши GraphQL запросы в React
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
