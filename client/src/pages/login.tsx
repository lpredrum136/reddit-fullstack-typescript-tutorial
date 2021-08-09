import { Box, Button, Spinner, Flex, useToast, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import {
	LoginInput,
	MeDocument,
	MeQuery,
	useLoginMutation
} from '../generated/graphql'
import { mapFieldErrors } from '../helpers/mapFieldErrors'
import { useCheckAuth } from '../utils/useCheckAuth'
import { initializeApollo } from '../lib/apolloClient'

const Login = () => {
	const router = useRouter()

	const { data: authData, loading: authLoading } = useCheckAuth()

	const initialValues: LoginInput = { usernameOrEmail: '', password: '' }

	const [loginUser, { loading: _loginUserLoading, error }] = useLoginMutation()

	const toast = useToast()

	const onLoginSubmit = async (
		values: LoginInput,
		{ setErrors }: FormikHelpers<LoginInput>
	) => {
		const response = await loginUser({
			variables: {
				loginInput: values
			},
			update(cache, { data }) {
				console.log('DATA LOGIN', data)

				// const meData = cache.readQuery({ query: MeDocument })
				// console.log('MEDATA', meData)

				if (data?.login.success) {
					cache.writeQuery<MeQuery>({
						query: MeDocument,
						data: { me: data.login.user }
					})
				}
			}
		})

		if (response.data?.login.errors) {
			setErrors(mapFieldErrors(response.data.login.errors))
		} else if (response.data?.login.user) {
			// register successfully
			toast({
				title: 'Welcome',
				description: `${response.data.login.user.username}`,
				status: 'success',
				duration: 3000,
				isClosable: true
			})

			const apolloClient = initializeApollo()
			apolloClient.resetStore()

			router.push('/')
		}
	}

	return (
		<>
			{authLoading || (!authLoading && authData?.me) ? (
				<Flex justifyContent='center' alignItems='center' minH='100vh'>
					<Spinner />
				</Flex>
			) : (
				<Wrapper size='small'>
					{error && <p>Failed to login. Internal server error.</p>}
					<Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
						{({ isSubmitting }) => (
							<Form>
								<InputField
									name='usernameOrEmail'
									placeholder='Username or Email'
									label='Username or Email'
									type='text'
								/>

								<Box mt={4}>
									<InputField
										name='password'
										placeholder='Password'
										label='Password'
										type='password'
									/>
								</Box>

								<Flex mt={2}>
									<NextLink href='/forgot-password'>
										<Link ml='auto'>Forgot Password</Link>
									</NextLink>
								</Flex>

								<Button
									type='submit'
									colorScheme='teal'
									mt={4}
									isLoading={isSubmitting}
								>
									Login
								</Button>
							</Form>
						)}
					</Formik>
				</Wrapper>
			)}
		</>
	)
}

export default Login
