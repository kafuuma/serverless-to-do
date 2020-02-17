import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'


import * as AWS from 'aws-sdk'
import { createLogger } from '../../utils/logger'

import {parseUserId} from '../../auth/utils'

const toDosTable = process.env.TODOS_TABLE

const docClient = new AWS.DynamoDB.DocumentClient()
const logger = createLogger('get-todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  logger.info('Processing event: ', event)

  const authHeader = event.headers.Authorization
  const authSplit = authHeader.split(" ")
  const token = authSplit[1]
  const userId = parseUserId(token)
 

  await docClient.delete({
    TableName: toDosTable,
    Key :{
      todoId,
      userId
    }
  }).promise()
  return {
    statusCode: 201,
    headers :{
      "Access-control-Allow-Origin": "*"
    },
    body: "Item Successfully removed"
  }
}
