import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/generated/client'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'
import Upload from 'graphql-upload/Upload.mjs'

import { Authorization, Authorized } from '@/shared/decorators'
import { FileValidationPipe } from '@/shared/pipes'

import { ChangeStreamInfoInput, FiltersInput } from './inputs'
import { StreamModel } from './models'
import { StreamService } from './stream.service'

@Resolver('Stream')
export class StreamResolver {
	public constructor(private readonly streamService: StreamService) {}

	@Query(() => [StreamModel], { name: 'getAllStreams' })
	public async getAll(@Args('filters') input: FiltersInput) {
		return this.streamService.getAll(input)
	}

	@Query(() => [StreamModel], { name: 'getRandomStreams' })
	public async getRandom() {
		return this.streamService.getRandom()
	}

	@Mutation(() => Boolean, { name: 'changeStreamInfo' })
	@Authorization()
	public async changeInfo(
		@Authorized('id') userId: string,
		@Args('data') input: ChangeStreamInfoInput,
	) {
		return this.streamService.changeInfo(userId, input)
	}

	@Mutation(() => Boolean, { name: 'changeStreamThumbnail' })
	@Authorization()
	public async changeThumbnail(
		@Authorized() user: User,
		@Args('thumbnail', { type: () => GraphQLUpload }, FileValidationPipe)
		thumbnail: Upload,
	) {
		return this.streamService.changeThumbnail(user, thumbnail)
	}

	@Mutation(() => Boolean, { name: 'removeStreamThumbnail' })
	@Authorization()
	public async removeThumbnail(@Authorized('id') userId: string) {
		return this.streamService.removeThumbnail(userId)
	}
}
