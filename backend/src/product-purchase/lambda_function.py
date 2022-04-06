import psycopg2
import json
from db import test_db
from operations import delete_purchase_product, get_purchase_product, create_purchase_product, edit_purchase_product
        
operations = {
    "DELETE": delete_purchase_product,
    "GET": get_purchase_product,
    "POST": create_purchase_product,
    "PUT": edit_purchase_product
}

headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, GET, OPTIONS, POST'
}

httpMethod = 'httpMethod'

def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': str(err) if err else json.dumps(res),
        'headers': headers,
    }

def lambda_handler(event, context):
    print(event)
    if (httpMethod in event):
        operation = event[httpMethod]
        if operation in operations:
            payload = None
            err_msg = None
            try:
                payload = event['queryStringParameters'] if operation == 'GET' else json.loads(event['body'])
            except:
                pass
            if not payload:
                return respond(ValueError('Error in body or queryStringParameters, cannot read'))
            try:
                cursor, conn = test_db()
                msg = operations[operation](cursor, **payload)
                cursor.close()
                conn.commit()
                conn.close()
                return respond(None, msg)
            except ValueError as err:
                err_msg = err
            except Exception as e:
                err_msg = str(e)
            except:
                err_msg = ValueError("Error in calling {} operation".format(operation))
            return respond(err_msg)
        else:
            return respond(ValueError('Unsupported method "{}"'.format(operation)))
    
    return respond(ValueError("Unsupported api call"))
