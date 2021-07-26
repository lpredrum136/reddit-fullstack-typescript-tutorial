import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useMeQuery } from '../generated/graphql'

export const useCheckAuth = () => {
	const router = useRouter()

	const { data, loading } = useMeQuery()

	useEffect(() => {
		if (
			!loading &&
			data?.me &&
			(router.route === '/login' || router.route === '/register')
		) {
			router.replace('/')
		}
	}, [data, loading, router])

	return { data, loading }
}
