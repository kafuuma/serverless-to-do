import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'


import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'

import { createTodo } from '../../businessLogic/todos'


const logger = createLogger('create todo-todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  try{
    const todoItem = await createTodo(event, newTodo)
    return {
      statusCode :201,
      headers:{
        'Access-Control-Allow-Origin': '*',
      },
      body : JSON.stringify({
        todoItem
      })
    }
  }catch(e){
    logger.info('Failed to create tod: ', e)
  }
}
