import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'

import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import {parseUserId} from '../../auth/utils'

const toDosTable = process.env.TODOS_TABLE

const docClient = new AWS.DynamoDB.DocumentClient()
const logger = createLogger('get-todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const parsedBody: CreateTodoRequest = JSON.parse(event.body)
 

  const authHeader = event.headers.Authorization
  const authSplit = authHeader.split(" ")
  const token = authSplit[1]
  const userId = parseUserId(token)
  const todoId = uuid.v4()

  const todoItem = {
    todoId,
    userId,
    done:false,
    attachmentUrl: "https://default.jpg",
    ...parsedBody
  }
  await docClient.put({
    TableName: toDosTable,
    Item: todoItem
  }).promise()

  return {
    statusCode :201,
    headers:{
      'Access-Control-Allow-Origin': '*',
    },
    body : JSON.stringify({
      todoItem
    })
  }
}
