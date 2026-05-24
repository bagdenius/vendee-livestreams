import {
	ValidationArguments,
	ValidatorConstraint,
	type ValidatorConstraintInterface,
} from 'class-validator'

import { NewPasswordInput } from '@/modules/auth/password-recovery/inputs/new-password.input'

@ValidatorConstraint({ name: 'IsPasswordsMathing', async: false })
export class IsPasswordsMathingConstraint implements ValidatorConstraintInterface {
	public validate(passwordConfirm: string, args: ValidationArguments): boolean {
		const object = args.object as NewPasswordInput
		return object.password === passwordConfirm
	}

	public defaultMessage(): string {
		return 'The passwords do not match'
	}
}
