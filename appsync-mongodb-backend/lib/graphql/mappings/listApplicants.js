import { util } from '@aws-appsync/utils'

export function request(ctx) {
	console.log('the result from the secret', ctx.prev.result)
	// #set($secret = util.parseJson(ctx.prev.result).key)
	const secret = JSON.parse(ctx.prev.result).APPSYNC_MONGO_API_KEY
	console.log(secret)

	return {
		method: 'POST',
		version: '2018-05-29',
		resourcePath: '/app/data-upuof/endpoint/data/v1/action/find',
		params: {
			headers: {
				'api-key': '$secret',
				'Content-Type': 'application/json',
				'Access-Control-Request-Headers': '*',
				Accept: 'application/json',
			},
			body: {
				dataSource: 'Cluster0',
				database: 'applicationEmployment',
				collection: 'employmentForm',
				// filter: { _id: { $oid: '$ctx.stash.id' } },
			},
		},
	}
}

export function response(ctx) {
	console.log(ctx.result.body)
	return ctx.result.body
}
