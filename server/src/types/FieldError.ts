import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class FieldError {
	@Field()
	field: string

	@Field()
	message: string
}
