import { util } from '@aws-appsync/utils'

export function request(ctx) {
	console.log(ctx.info)
	console.log(ctx.args.input)
	switch (ctx.info.fieldName) {
		case 'listApplicants':
			return {}
		case 'addApplicant':
			console.log(ctx.args.input)
			ctx.stash = { applicantData: ctx.args.input }
			return {}
		default:
			return {}
	}
}

export function response(ctx) {
	console.log(ctx.prev.result)
	return ctx.prev.result
}
