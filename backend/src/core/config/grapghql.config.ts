import { ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
import { join } from 'path'

import { isDev } from '@/shared/utils'

type GraphQLContextParams = {
	request: Request
	response: Response
}

export function getGraphQLConfig(
	configService: ConfigService,
): ApolloDriverConfig {
	return {
		playground: isDev(configService),
		path: configService.getOrThrow<string>('GRAPHQL_PREFIX'),
		autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
		sortSchema: true,
		context: ({ request, response }: GraphQLContextParams) => ({
			request,
			response,
		}),
	}
}
