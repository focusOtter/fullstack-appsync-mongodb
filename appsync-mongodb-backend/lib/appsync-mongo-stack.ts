import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as appsync from '@aws-cdk/aws-appsync-alpha'
import * as path from 'path'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { CfnFunctionConfiguration, CfnResolver } from 'aws-cdk-lib/aws-appsync'
import { readFileSync } from 'fs'

export class AppsyncMongoStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		//create our API
		const api = new appsync.GraphqlApi(this, 'AppSyncToMongoAPI', {
			name: 'AppSyncToMongoAPI',
			schema: appsync.SchemaFile.fromAsset(
				path.join(__dirname, 'graphql/schema.graphql')
			),
			authorizationConfig: {
				defaultAuthorization: {
					authorizationType: appsync.AuthorizationType.API_KEY,
				},
			},
			logConfig: {
				fieldLogLevel: appsync.FieldLogLevel.ALL,
			},
			xrayEnabled: true,
		})

		// Create our 2 datasources

		// Secrets Manager
		const secretsManagerDS = api.addHttpDataSource(
			'secretsManager',
			'https://secretsmanager.us-east-1.amazonaws.com',
			{
				authorizationConfig: {
					signingRegion: 'us-east-1',
					signingServiceName: 'secretsmanager',
				},
			}
		)

		// The MongoDB API
		const mongoDataAPIDS = api.addHttpDataSource(
			'mongoDBAtlasCluster',
			'https://data.mongodb-api.com'
		)

		// policy to permit an http datasource to get a secret in Secrets Manager
		secretsManagerDS.grantPrincipal.addToPrincipalPolicy(
			new PolicyStatement({
				resources: [
					`arn:aws:secretsmanager:us-east-1:${process.env.CDK_DEFAULT_ACCOUNT}:secret:APPSYNC_MONGO_API_KEY-xAUsuN`,
				],
				actions: ['secretsmanager:GetSecretValue'],
			})
		)
		///////////////
		// Create a function that gets the secret
		const getMongoSecretFunc = new appsync.AppsyncFunction(
			this,
			'getMongoSecretFunc',
			{
				api,
				dataSource: secretsManagerDS,
				name: 'getMongoSecretFromSSM',
			}
		)

		// Escape hatch to access L1 construct
		const cfnGetMongoSecretFunc = getMongoSecretFunc.node
			.defaultChild as CfnFunctionConfiguration

		cfnGetMongoSecretFunc.runtime = {
			name: 'APPSYNC_JS',
			runtimeVersion: '1.0.0',
		}
		cfnGetMongoSecretFunc.code = readFileSync(
			'./graphql/mappings/getMongoSecret.js',
			'utf-8'
		)

		////////////////

		// Create a function that will list the Applicants from MongoDB
		const listApplicantsFunction = new appsync.AppsyncFunction(
			this,
			'listApplicantsFunction',
			{
				api,
				dataSource: mongoDataAPIDS,
				name: 'listApplicantsFunction',
			}
		)

		// Escape hatch to access L1 construct
		const cfnListApplicantsFunction = getMongoSecretFunc.node
			.defaultChild as CfnFunctionConfiguration

		cfnListApplicantsFunction.runtime = {
			name: 'APPSYNC_JS',
			runtimeVersion: '1.0.0',
		}
		cfnListApplicantsFunction.code = readFileSync(
			'./graphql/mappings/listApplicants.js',
			'utf-8'
		)

		////////////////////
		// Create a function that will add an Applicant to MongoDB
		const addApplicantFunction = new appsync.AppsyncFunction(
			this,
			'addApplicantFunction',
			{
				api,
				dataSource: mongoDataAPIDS,
				name: 'addApplicantFunction',
			}
		)

		// Escape hatch to access L1 construct
		const cfnAddApplicantFunction = getMongoSecretFunc.node
			.defaultChild as CfnFunctionConfiguration

		cfnAddApplicantFunction.runtime = {
			name: 'APPSYNC_JS',
			runtimeVersion: '1.0.0',
		}
		cfnGetMongoSecretFunc.code = readFileSync(
			'./graphql/mappings/Mutation.listRooms.js',
			'utf-8'
		)
		///////////////

		// Create a pipeline that has a "before" and "after" step + our fns
		const listApplicantsPipelineResolver = new appsync.Resolver(
			this,
			'listApplicantsPipelineResolver',
			{
				api,
				typeName: 'Query',
				fieldName: 'listApplicants',
				pipelineConfig: [getMongoSecretFunc, listApplicantsFunction],
			}
		)

		// Escape hatch to access L1 construct
		const cfnListApplicantsPipelineResolver = listApplicantsPipelineResolver
			.node.defaultChild as CfnResolver

		cfnListApplicantsPipelineResolver.runtime = {
			name: 'APPSYNC_JS',
			runtimeVersion: '1.0.0',
		}
		cfnGetMongoSecretFunc.code = readFileSync(
			'./graphql/mappings/Mutation.listRooms.js',
			'utf-8'
		)

		///////////////////

		// Create a pipeline that has a "before" and "after" step + our fns
		// const addApplicantPipelineResolver = new appsync.Resolver(
		// 	this,
		// 	'addApplicantPipelineResolver',
		// 	{
		// 		api,
		// 		typeName: 'Mutation',
		// 		fieldName: 'addApplicant',
		// 		pipelineConfig: [getMongoSecretFunc, addApplicantFunction],
		// 	}
		// )

		// // Escape hatch to access L1 construct
		// const cfnAddApplicantPipelineResolver = addApplicantPipelineResolver.node
		// 	.defaultChild as CfnResolver

		// cfnAddApplicantPipelineResolver.runtime = {
		// 	name: 'APPSYNC_JS',
		// 	runtimeVersion: '1.0.0',
		// }
		// cfnGetMongoSecretFunc.code = readFileSync(
		// 	'./graphql/mappings/Mutation.listRooms.js',
		// 	'utf-8'
		// )

		//////////////////////////
		new cdk.CfnOutput(this, 'appsync api key', {
			value: api.apiKey!,
		})

		new cdk.CfnOutput(this, 'appsync endpoint', {
			value: api.graphqlUrl,
		})
	}
}
