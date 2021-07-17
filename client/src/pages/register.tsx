import { Formik, Form } from 'formik'
import { FormControl, Button, Box } from '@chakra-ui/react'
import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'

const Register = () => {
	return (
		<Wrapper>
			<Formik
				initialValues={{ username: '', password: '' }}
				onSubmit={values => console.log(values)}
			>
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
