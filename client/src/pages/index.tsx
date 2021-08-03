import { PostsDocument, usePostsQuery } from '../generated/graphql'
import { addApolloState, initializeApollo } from '../lib/apolloClient'
import {
	Box,
	Flex,
	Spinner,
	Stack,
	Link,
	Heading,
	Text
} from '@chakra-ui/react'
import NextLink from 'next/link'
import Layout from '../components/Layout'
import PostEditDeleteButtons from '../components/PostEditDeleteButtons'

const Index = () => {
	const { data, loading } = usePostsQuery()
	return (
		<Layout>
			{loading ? (
				<Flex justifyContent='center' alignItems='center' minH='100vh'>
					<Spinner />
				</Flex>
			) : (
				<Stack spacing={8}>
					{data?.posts?.map(post => (
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
										<PostEditDeleteButtons />
									</Box>
								</Flex>
							</Box>
						</Flex>
					))}
				</Stack>
			)}
		</Layout>
	)
}

export const getStaticProps = async () => {
	const apolloClient = initializeApollo()

	await apolloClient.query({
		query: PostsDocument
	})

	return addApolloState(apolloClient, {
		props: {}
	})
}

export default Index
