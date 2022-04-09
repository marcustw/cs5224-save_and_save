import psycopg2
import json
from db import test_db
from operations import getPopularProducts, getPopularTime

operations = {
    "GET":getPopularProducts,
    "product": getPopularProducts,
    "time": getPopularTime
}

httpMethod = 'httpMethod'

headers = {
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, GET, OPTIONS, POST'
}


def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': str(err) if err else json.dumps(res),
        'headers': headers,
    }


def lambda_handler(event, context):
    if (httpMethod in event):
        operation = event[httpMethod]
        if operation in operations:
            cursor = test_db()
            queryParams = event['queryStringParameters'] if 'queryStringParameters' in event else None
            if queryParams:
                if "type" in  queryParams:
                    type = queryParams['type']
                    if type == 'product':
                        return respond(None, operations[type](cursor=cursor, **queryParams))
                    elif  type == 'time':
                        return respond(None, operations[type](cursor=cursor, **queryParams))
        else:
            return respond(ValueError('Unsupported method "{}"'.format(operation)))
    
    return respond(ValueError("Unsupported api call"))
