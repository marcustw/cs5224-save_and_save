import psycopg2
import json
from db import test_db
from operations import deleteAll, getAll

operations = {
    "DELETE": deleteAll,
    "GET": getAll,
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
            if (operation == "DELETE"):
                return respond(None, operations[operation](cursor))
            else:
                queryParams = event['queryStringParameters'] if 'queryStringParameters' in event else None
                if queryParams:
                    return respond(None, operations[operation](cursor=cursor, **queryParams))
                else:
                    return respond(None, operations[operation](cursor=cursor))
        else:
            return respond(ValueError('Unsupported method "{}"'.format(operation)))
    
    return respond(ValueError("Unsupported api call"))
