import { Field, ID, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

@ObjectType()
@Entity() // db table
export class User extends BaseEntity {
	@Field(_type => ID)
	@PrimaryGeneratedColumn()
	id!: number

	@Field()
	@Column({ unique: true })
	username!: string

	@Field()
	@Column({ unique: true })
	email!: string

	@Column()
	password!: string

	@Field()
	@CreateDateColumn()
	createdAt: Date

	@Field()
	@UpdateDateColumn()
	updatedAt: Date
}
