import { Box, Button, FormControl } from '@chakra-ui/react'
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

const Login = () => {
	const router = useRouter()
	const initialValues: LoginInput = { usernameOrEmail: '', password: '' }

	const [loginUser, { loading: _loginUserLoading, data, error }] =
		useLoginMutation()

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
			router.push('/')
		}
	}

	return (
		<Wrapper>
			{error && <p>Failed to login. Internal server error.</p>}
			{data && data.login.success && (
				<p>Logged in successfully {JSON.stringify(data)}</p>
			)}
			<Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
				{({ isSubmitting }) => (
					<Form>
						<FormControl>
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
							<Button
								type='submit'
								colorScheme='teal'
								mt={4}
								isLoading={isSubmitting}
							>
								Login
							</Button>
						</FormControl>
					</Form>
				)}
			</Formik>
		</Wrapper>
	)
}

export default Login
