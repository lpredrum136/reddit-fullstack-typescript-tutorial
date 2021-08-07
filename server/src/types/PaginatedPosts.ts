import { Post } from '../entities/Post'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class PaginatedPosts {
	@Field()
	totalCount!: number

	@Field(_type => Date)
	cursor!: Date

	@Field()
	hasMore!: boolean

	@Field(_type => [Post])
	paginatedPosts!: Post[]
}
