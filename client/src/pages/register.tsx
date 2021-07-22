import { Formik, Form, FormikHelpers } from 'formik'
import { FormControl, Button, Box } from '@chakra-ui/react'
import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'

import { RegisterInput, useRegisterMutation } from '../generated/graphql'
import { mapFieldErrors } from '../helpers/mapFieldErrors'
import { useRouter } from 'next/router'

const Register = () => {
	const router = useRouter()
	const initialValues: RegisterInput = { username: '', email: '', password: '' }

	const [registerUser, { loading: _registerUserLoading, data, error }] =
		useRegisterMutation()

	const onRegisterSubmit = async (
		values: RegisterInput,
		{ setErrors }: FormikHelpers<RegisterInput>
	) => {
		const response = await registerUser({
			variables: {
				registerInput: values
			}
		})

		if (response.data?.register.errors) {
			setErrors(mapFieldErrors(response.data.register.errors))
		} else if (response.data?.register.user) {
			// register successfully
			router.push('/')
		}
	}

	return (
		<Wrapper>
			{error && <p>Failed to register</p>}
			{data && data.register.success && (
				<p>Registered successfully {JSON.stringify(data)}</p>
			)}
			<Formik initialValues={initialValues} onSubmit={onRegisterSubmit}>
				{({ isSubmitting }) => (
					<Form>
						<FormControl>
							<InputField
								name='username'
								placeholder='Username'
								label='Username'
								type='text'
							/>
							<Box mt={4}>
								<InputField
									name='email'
									placeholder='Email'
									label='Email'
									type='text'
								/>
							</Box>
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
								Register
							</Button>
						</FormControl>
					</Form>
				)}
			</Formik>
		</Wrapper>
	)
}

export default Register
