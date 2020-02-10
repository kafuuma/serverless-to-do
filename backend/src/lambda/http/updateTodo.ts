import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as AWS from 'aws-sdk'
import { createLogger } from '../../utils/logger'

import {parseUserId} from '../../auth/utils' 

const toDosTable = process.env.TODOS_TABLE

const docClient = new AWS.DynamoDB.DocumentClient()
const logger = createLogger('get-todo')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const authHeader = event.headers.Authorization
  const authSplit = authHeader.split(" ")
  const token = authSplit[1]
  const userId = parseUserId(token)
  
  const updatedTodoParams = {
    TableName: toDosTable,
    Key: {
      "todoId": todoId,
      userId:userId
    },
      UpdateExpression : "set #name = :a, #dueDate = :b, #done = :c",
      ExpressionAttributeValues:{
        ":a": updatedTodo.name,
        ":b": updatedTodo.dueDate,
        ":c": updatedTodo.done
      },
      ExpressionAttributeNames:{
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done'
      },
    ReturnValues:"UPDATED_NEW"
  }

  const result = await docClient.update(updatedTodoParams).promise()
  return {
    statusCode: 201,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      result
    })
}
}
