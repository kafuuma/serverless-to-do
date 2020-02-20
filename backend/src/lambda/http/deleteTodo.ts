import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../businessLogic/todos'


const logger = createLogger('delete-todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)

  try{
    await deleteTodo(event)
    return {
      statusCode: 202,
      headers :{
        "Access-control-Allow-Origin": "*"
      },
      body: "Item Successfully removed"
    }

  }catch(e){
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Item does not exist'
      })
    };
  }
}
