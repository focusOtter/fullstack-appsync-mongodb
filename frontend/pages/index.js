import { Flex } from '@aws-amplify/ui-react'
import { API } from 'aws-amplify'
import { MyForm } from '../ui-components'
import { addApplicant } from '../src/graphql/mutations'

export default function Home() {
	const handleSubmit = async (values) => {
		console.log(values)
		const res = await API.graphql({
			query: addApplicant,
			variables: {
				input: {
					...values,
					employmentStatus: values.employmentStatus.toUpperCase(),
				},
			},
		})
		console.log(res)
	}
	return (
		<Flex justifyContent={'center'}>
			<MyForm width={{ sm: '90vw', medium: '40vw' }} onSubmit={handleSubmit} />
		</Flex>
	)
}
