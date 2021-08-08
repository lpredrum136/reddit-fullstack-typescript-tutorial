import { Field, ID, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { Upvote } from './Upvote'
import { User } from './User'

@ObjectType()
@Entity()
export class Post extends BaseEntity {
	@Field(_type => ID)
	@PrimaryGeneratedColumn()
	id!: number

	@Field()
	@Column()
	title!: string

	@Field()
	@Column()
	userId!: number

	@Field(_type => User)
	@ManyToOne(() => User, user => user.posts)
	user: User

	@OneToMany(_to => Upvote, upvote => upvote.post)
	upvotes: Upvote[]

	@Field()
	@Column({ default: 0 })
	points!: number

	@Field()
	voteType!: number

	@Field()
	@Column()
	text!: string

	@Field()
	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date

	@Field()
	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date
}
