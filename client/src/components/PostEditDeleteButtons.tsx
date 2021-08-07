import { Box, IconButton } from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import { useDeletePostMutation, useMeQuery } from '../generated/graphql'

interface PostEditDeleteButtonsProps {
	postId: string
	postUserId: string
}

const PostEditDeleteButtons = ({
	postId,
	postUserId
}: PostEditDeleteButtonsProps) => {
	const { data: meData } = useMeQuery()
	const [deletePost, _] = useDeletePostMutation()

	const onPostDelete = async (postId: string) => {
		await deletePost({ variables: { id: postId } })
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
