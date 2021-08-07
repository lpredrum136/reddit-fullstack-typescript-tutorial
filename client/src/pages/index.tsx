import { PostsDocument, useMeQuery, usePostsQuery } from '../generated/graphql'
import { addApolloState, initializeApollo } from '../lib/apolloClient'
import {
	Box,
	Flex,
	Spinner,
	Stack,
	Link,
	Heading,
	Text,
	Button
} from '@chakra-ui/react'
import NextLink from 'next/link'
import Layout from '../components/Layout'
import PostEditDeleteButtons from '../components/PostEditDeleteButtons'
import { NetworkStatus } from '@apollo/client'
import { GetStaticProps } from 'next'

export const limit = 3

const Index = () => {
	const { data: meData } = useMeQuery()

	const { data, loading, error, fetchMore, networkStatus } = usePostsQuery({
		variables: { limit },

		// component nao render boi cai Posts query, se rerender khi networkStatus thay doi, tuc la fetchMore
		notifyOnNetworkStatusChange: true
	})

	const loadingMorePosts = networkStatus === NetworkStatus.fetchMore

	const loadMorePosts = () =>
		fetchMore({ variables: { cursor: data?.posts?.cursor } })

	return (
		<Layout>
			{loading && !loadingMorePosts ? (
				<Flex justifyContent='center' alignItems='center' minH='100vh'>
					<Spinner />
				</Flex>
			) : (
				<Stack spacing={8}>
					{data?.posts?.paginatedPosts.map(post => (
						<Flex key={post.id} p={5} shadow='md' borderWidth='1px'>
							<Box flex={1}>
								<NextLink href={`/post/${post.id}`}>
									<Link>
										<Heading fontSize='xl'>{post.title}</Heading>
									</Link>
								</NextLink>
								<Text>posted by {post.user.username}</Text>
								<Flex align='center'>
									<Text mt={4}>{post.textSnippet}</Text>
									<Box ml='auto'>
										<PostEditDeleteButtons
											postId={post.id}
											postUserId={post.user.id}
										/>
									</Box>
								</Flex>
							</Box>
						</Flex>
					))}
				</Stack>
			)}

			{data?.posts?.hasMore && (
				<Flex>
					<Button
						m='auto'
						my={8}
						isLoading={loadingMorePosts}
						onClick={loadMorePosts}
					>
						{loadingMorePosts ? 'Loading' : 'Show more'}
					</Button>
				</Flex>
			)}
		</Layout>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	const apolloClient = initializeApollo()

	await apolloClient.query({
		query: PostsDocument,
		variables: {
			limit
		}
	})

	return addApolloState(apolloClient, {
		props: {}
	})
}

export default Index
