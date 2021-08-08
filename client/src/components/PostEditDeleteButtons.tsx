import { Box, IconButton } from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import {
	PaginatedPosts,
	useDeletePostMutation,
	useMeQuery
} from '../generated/graphql'
import { Reference } from '@apollo/client'
import { useRouter } from 'next/router'

interface PostEditDeleteButtonsProps {
	postId: string
	postUserId: string
}

const PostEditDeleteButtons = ({
	postId,
	postUserId
}: PostEditDeleteButtonsProps) => {
	const router = useRouter()
	const { data: meData } = useMeQuery()
	const [deletePost, _] = useDeletePostMutation()

	const onPostDelete = async (postId: string) => {
		await deletePost({
			variables: { id: postId },
			update(cache, { data }) {
				if (data?.deletePost.success) {
					cache.modify({
						fields: {
							posts(
								existing: Pick<
									PaginatedPosts,
									'__typename' | 'cursor' | 'hasMore' | 'totalCount'
								> & { paginatedPosts: Reference[] }
							) {
								const newPostsAfterDeletion = {
									...existing,
									totalCount: existing.totalCount - 1,
									paginatedPosts: existing.paginatedPosts.filter(
										postRefObject => postRefObject.__ref !== `Post:${postId}`
									)
								}

								return newPostsAfterDeletion
							}
						}
					})
				}
			}
		})

		if (router.route !== '/') router.push('/')
	}

	if (meData?.me?.id !== postUserId) return null

	return (
		<Box>
			<NextLink href={`/post/edit/${postId}`}>
				<IconButton icon={<EditIcon />} aria-label='edit' mr={4} />
			</NextLink>

			<IconButton
				icon={<DeleteIcon />}
				aria-label='delete'
				colorScheme='red'
				onClick={onPostDelete.bind(this, postId)}
			/>
		</Box>
	)
}

export default PostEditDeleteButtons
