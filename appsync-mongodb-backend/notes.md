## Random Notes During Development

- `ctx.stash.put` doesn't work. It's now `ctx.stash = {}`
- no intellisense in JS mappings
- docs don't contain guideance on setting up TS for mapping Templates manually.
- no directions on how to setup eslint config aside from installing the package.
- My most frustating thing is that I don't know when I need to parse/stringify a request/response vs when it'll come through as an object.
- There should definitely be a `util` that will let me integrate with secrets manager
- I'm working with a MongoDB Atlas cluster via their Data API (HTTP Resolver), it'd be great if they published a library that let me easily interact with their data API:

```js
import { util } from '@aws-appsync/utils'
import mongodb from 'appsync-mongodb'

export function request(ctx) {
	const { mongoAPIMappings } = util.addExtensions([mongodb])

	const mapping = mongoAPIMappings.findOne({
		secret: ctx.stash.Secret,
		body: {
			dataSource: 'Cluster0',
			database: 'db_name',
			collection: 'collection_name',
			filter: { _id: { $oid: '$ctx.stash.id' } },
		},
	})
	// mapping for an HTTP resolver. See /graphql/mappings/listApplicants.js for the value.
	return mapping
}
```

- No clear direction on how to effectively use `evaluateCode` in development workflow
- I gave up iterating in the CDK and instead used the console. Experience is much friendlier
- In my pipeline, I like the pattern of `switch`ing on the `ctx.info.fieldName` to avoid creating several pipeline files:

```js
switch (ctx.info.fieldName) {
	case 'listApplicants':
		return {}
	case 'addApplicant':
		console.log(ctx.args.input)
		ctx.stash.put('applicantData', ctx.args.input)
		return {}
	default:
		return {}
}
```

- In the console, when I got an error in my resolver code during creation, I'm asked to "Run test, or save to refresh errors". I can't find where that is. [update] After fixing the error and saving, the options showed up.
- Still in the console, I ran my query and had an error. but it only said `code.js:6:17: ReferenceError: variable is not defined`. I went to CloudWatch, but there was no log group. I was able to enable logging, but considering how much frontend devs love using `console.log`, this option should be more discoverable in the early stages of creating the API.
- The console can't be used to interact with internal AWS services(?) ie Secrets Manager. This seems like a pretty big limitation considering we are pushing direct integrations.
- In VS Code, using the AWS Toolkit extension allows me to view cloudwatch logs.
