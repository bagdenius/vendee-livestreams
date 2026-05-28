import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GeneratedTokenModel {
	@Field(() => String)
	public token: string
}
