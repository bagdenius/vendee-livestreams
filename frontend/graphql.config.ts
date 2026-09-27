import type { CodegenConfig } from '@graphql-codegen/cli'
import 'dotenv/config'

const config: CodegenConfig = {
	schema: 'http://localhost:4000/graphql',
	documents: ['./src/graphql/**/*.graphql'],
	generates: {
		'./src/graphql/generated/output.ts': {
			plugins: ['typescript-operations', 'typescript-react-apollo'],
			config: { enumType: 'native' },
		},
	},
	ignoreNoDocuments: true,
}

export default config
