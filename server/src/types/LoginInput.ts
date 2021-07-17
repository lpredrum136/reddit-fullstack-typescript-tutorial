import { Field, InputType } from 'type-graphql'

@InputType()
export class LoginInput {
	@Field()
	usernameOrEmail: string

	@Field()
	password: string
}
