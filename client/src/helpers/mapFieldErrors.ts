// [
//   {field: 'username', message: 'some error'}
// ]
// {
//   username: 'some error'
// }

import { FieldError } from '../generated/graphql'

export const mapFieldErrors = (errors: FieldError[]) => {
	return errors.reduce(
		(accumulatedErrorsObj, error) => ({
			...accumulatedErrorsObj,
			[error.field]: error.message
		}),
		{}
	)
}
