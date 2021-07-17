import { Field, ObjectType } from 'type-graphql'
import { IMutationResponse } from './MutationResponse'
import { FieldError } from './FieldError'
import { Post } from '../entities/Post'

@ObjectType({ implements: IMutationResponse })
export class PostMutationResponse implements IMutationResponse {
	code: number
	success: boolean
	message?: string

	@Field({ nullable: true })
	post?: Post

	@Field(_type => [FieldError], { nullable: true })
	errors?: FieldError[]
}
