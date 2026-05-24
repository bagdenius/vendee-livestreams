import { Field, InputType } from '@nestjs/graphql'
import {
	IsNotEmpty,
	IsString,
	IsUUID,
	MinLength,
	Validate,
} from 'class-validator'

import { IsPasswordsMathingConstraint } from '@/shared/decorators/is-passwords-matching-constraint.decorator'

@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	public password: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@Validate(IsPasswordsMathingConstraint)
	public passwordConfirm: string

	@Field(() => String)
	@IsUUID('4')
	@IsNotEmpty()
	public token: string
}
