import { UpdatePostInput } from '../types/UpdatePostInput'
import { Arg, ID, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { Post } from '../entities/Post'
import { CreatePostInput } from '../types/CreatePostInput'
import { PostMutationResponse } from '../types/PostMutationResponse'
import { checkAuth } from '../middleware/checkAuth'

@Resolver()
export class PostResolver {
	@Mutation(_return => PostMutationResponse)
	@UseMiddleware(checkAuth)
	async createPost(
		@Arg('createPostInput') { title, text }: CreatePostInput
	): Promise<PostMutationResponse> {
		try {
			const newPost = Post.create({
				title,
				text
			})

			await newPost.save()

			return {
				code: 200,
				success: true,
				message: 'Post created successfully',
				post: newPost
			}
		} catch (error) {
			console.log(error)
			return {
				code: 500,
				success: false,
				message: `Internal server error ${error.message}`
			}
		}
	}

	@Query(_return => [Post], { nullable: true })
	async posts(): Promise<Post[] | null> {
		try {
			return await Post.find()
		} catch (error) {
			console.log(error)
			return null
		}
	}

	@Query(_return => Post, { nullable: true })
	async post(@Arg('id', _type => ID) id: number): Promise<Post | undefined> {
		try {
			const post = await Post.findOne(id)
			return post
		} catch (error) {
			console.log(error)
			return undefined
		}
	}

	@Mutation(_return => PostMutationResponse)
	@UseMiddleware(checkAuth)
	async updatePost(
		@Arg('updatePostInput') { id, title, text }: UpdatePostInput
	): Promise<PostMutationResponse> {
		const existingPost = await Post.findOne(id)
		if (!existingPost)
			return {
				code: 400,
				success: false,
				message: 'Post not found'
			}

		existingPost.title = title
		existingPost.text = text

		await existingPost.save()

		return {
			code: 200,
			success: true,
			message: 'Post updated successfully',
			post: existingPost
		}
	}

	@Mutation(_returns => PostMutationResponse)
	@UseMiddleware(checkAuth)
	async deletePost(
		@Arg('id', _type => ID) id: number
	): Promise<PostMutationResponse> {
		const existingPost = await Post.findOne(id)
		if (!existingPost)
			return {
				code: 400,
				success: false,
				message: 'Post not found'
			}

		await Post.delete({ id })

		return { code: 200, success: true, message: 'Post deleted successfully' }
	}
}
