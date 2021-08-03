import Wrapper from '../components/Wrapper'
import { Formik, Form } from 'formik'
import InputField from '../components/InputField'
import { Box, Button, Flex, Spinner, Link } from '@chakra-ui/react'
import {
	ForgotPasswordInput,
	useForgotPasswordMutation
} from '../generated/graphql'
import { useCheckAuth } from '../utils/useCheckAuth'
import NextLink from 'next/link'

const ForgotPassword = () => {
	const { data: authData, loading: authLoading } = useCheckAuth()

	const initialValues = { email: '' }

	const [forgotPassword, { loading, data }] = useForgotPasswordMutation()

	const onForgotPasswordSubmit = async (values: ForgotPasswordInput) => {
		await forgotPassword({ variables: { forgotPasswordInput: values } })
	}

	if (authLoading || (!authLoading && authData?.me)) {
		return (
			<Flex justifyContent='center' alignItems='center' minH='100vh'>
				<Spinner />
			</Flex>
		)
	} else
		return (
			<Wrapper size='small'>
				<Formik initialValues={initialValues} onSubmit={onForgotPasswordSubmit}>
					{({ isSubmitting }) =>
						!loading && data ? (
							<Box>Please check your inbox</Box>
						) : (
							<Form>
								<InputField
									name='email'
									placeholder='Email'
									label='Email'
									type='email'
								/>

								<Flex mt={2}>
									<NextLink href='/login'>
										<Link ml='auto'>Back to Login</Link>
									</NextLink>
								</Flex>

								<Button
									type='submit'
									colorScheme='teal'
									mt={4}
									isLoading={isSubmitting}
								>
									Send Reset Password Email
								</Button>
							</Form>
						)
					}
				</Formik>
			</Wrapper>
		)
}

export default ForgotPassword
