import { Field, InputType } from 'type-graphql'

@InputType()
export class ChangePasswordInput {
	@Field()
	newPassword: string
}
