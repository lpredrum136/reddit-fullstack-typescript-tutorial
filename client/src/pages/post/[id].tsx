import {
	Alert,
	AlertIcon,
	AlertTitle,
	Box,
	Button,
	Flex,
	Heading,
	Spinner
} from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import {
	PostDocument,
	PostIdsDocument,
	PostIdsQuery,
	PostQuery,
	usePostQuery
} from '../../generated/graphql'
import { addApolloState, initializeApollo } from '../../lib/apolloClient'
import { limit } from '../index'
import NextLink from 'next/link'
import PostEditDeleteButtons from '../../components/PostEditDeleteButtons'

const Post = () => {
	const router = useRouter()
	const { data, loading, error } = usePostQuery({
		variables: { id: router.query.id as string }
	})

	if (loading)
		return (
			<Layout>
				<Flex justifyContent='center' alignItems='center' minH='100vh'>
					<Spinner />
				</Flex>
			</Layout>
		)

	if (error || !data?.post)
		return (
			<Layout>
				<Alert status='error'>
					<AlertIcon />
					<AlertTitle>{error ? error.message : 'Post not found'}</AlertTitle>
				</Alert>
				<Box mt={4}>
					<NextLink href='/'>
						<Button>Back to Homepage</Button>
					</NextLink>
				</Box>
			</Layout>
		)

	return (
		<Layout>
			<Heading mb={4}>{data.post.title}</Heading>
			<Box mb={4}>{data.post.text}</Box>
			<Flex justifyContent='space-between' alignItems='center'>
				<PostEditDeleteButtons
					postId={data.post.id}
					postUserId={data.post.userId.toString()}
				/>
				<NextLink href='/'>
					<Button>Back to Homepage</Button>
				</NextLink>
			</Flex>
		</Layout>
	)
}

export const getStaticPaths: GetStaticPaths = async () => {
	// [
	//   { params: { id: '15'} },
	//   { params: { id: '16'} }
	// ]

	const apolloClient = initializeApollo()

	const { data } = await apolloClient.query<PostIdsQuery>({
		query: PostIdsDocument,
		variables: { limit }
	})

	return {
		paths: data.posts!.paginatedPosts.map(post => ({
			params: { id: `${post.id}` }
		})),
		fallback: 'blocking'
	}
}

export const getStaticProps: GetStaticProps<
	{ [key: string]: any },
	{ id: string }
> = async ({ params }) => {
	const apolloClient = initializeApollo()

	await apolloClient.query<PostQuery>({
		query: PostDocument,
		variables: { id: params?.id }
	})

	return addApolloState(apolloClient, { props: {} })
}

export default Post
