import { util } from '@aws-appsync/utils'

export function request(ctx) {
	console.log('the result from the secret', ctx.prev.result)
	const secret = ctx.prev.result

	return {
		method: 'POST',
		version: '2018-05-29',
		resourcePath: '/app/data-upuof/endpoint/data/v1/action/find',
		params: {
			headers: {
				'api-key': secret,
				'Content-Type': 'application/json',
				'Access-Control-Request-Headers': '*',
				Accept: 'application/json',
			},
			body: {
				dataSource: 'Cluster0',
				database: 'applicationEmployment',
				collection: 'employmentForm',
			},
		},
	}
}

export function response(ctx) {
	console.log(ctx.result.body)
	const records = JSON.parse(ctx.result.body).documents
	return records
}
