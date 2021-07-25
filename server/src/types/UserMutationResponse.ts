import { User } from '../entities/User'
import { Field, ObjectType } from 'type-graphql'
import { IMutationResponse } from './MutationResponse'
import { FieldError } from './FieldError'

@ObjectType({ implements: IMutationResponse })
export class UserMutationResponse implements IMutationResponse {
	code: number
	success: boolean
	message?: string

	@Field({ nullable: true })
	user?: User

	@Field(_type => [FieldError], { nullable: true })
	errors?: FieldError[]
}
