import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { AppsyncMongoStack } from '../lib/appsync-mongo-stack'

const app = new cdk.App()
new AppsyncMongoStack(app, 'AppsyncMongoStack', {})
