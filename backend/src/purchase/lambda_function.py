import json
from operations import *

operations_dict = {
    'POST': handle_post_purchase
}

httpMethod = 'httpMethod'

headers = {
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST'
}

def lambda_handler(event, context):
    print(event)
    # Prepare template response
    response = {
        'statusCode': None,
        'body': None,
        'headers': headers
    }
    
    # Validate event
    valid_event, operation = validate_event(event, response)

    if not valid_event:
        return response

    # Execute operation
    operation_handler = operations_dict[operation]
    operation_handler(event, response)
    
    return response

# HELPERS
def debug(event, context):
    print('## EVENT')
    print(event)
    print('## CONTEXT')
    print(context)

def validate_event(event, response):
    operation = None
    if 'httpMethod' not in event:
        response['statusCode'] = 400
        response['body'] = json.dumps('Bad Request: Invalid API Request')
        return False, operation
        
    if 'headers' not in event:
        response['statusCode'] = 400
        response['body'] = json.dumps('Bad Request: No Headers present')
        return False, operation
        
    operation = event[httpMethod] 
    
    if operation not in operations_dict:
        response['statusCode'] = 400
        response['body'] = json.dumps('Bad Request: Operation Key Invalid')
        return False, operation
    
    return True, operation