import { applyDecorators, UseGuards } from '@nestjs/common'

import { GraphQLAuthGuard } from '../guards'

export function Authorization() {
	return applyDecorators(UseGuards(GraphQLAuthGuard))
}
