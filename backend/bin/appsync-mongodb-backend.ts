import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { AppsyncMongoStack } from '../lib/appsync-mongo-stack'

const app = new cdk.App()
new AppsyncMongoStack(app, 'AppsyncMongoStack', {
	MONGO_SECRET_ARN: `arn:aws:secretsmanager:${process.env.CDK_DEFAULT_REGION}:${process.env.CDK_DEFAULT_ACCOUNT}:secret:APPSYNC_MONGO_API_KEY-xAUsuN`,
})
