import json
from operations import *

headers = {
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, GET, OPTIONS, POST'
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
    valid_event = validate_event(event, response)

    if not valid_event:
        return response

    # Execute operation
    handle_upload_csv(event, response)
    
    return response
    

# HELPERS
def debug(event, context):
    print('## EVENT')
    print(event)
    print('## CONTEXT')
    print(context)

def validate_event(event, response):
    if 'httpMethod' not in event:
        response['statusCode'] = 400
        response['body'] = json.dumps('Bad Request: Invalid API Request')
        return False
        
    if 'headers' not in event:
        response['statusCode'] = 400
        response['body'] = json.dumps('Bad Request: No Headers present')
        return False
        
    if 'queryStringParameters' not in event:
        response['statusCode'] = 400
        response['body'] = json.dumps('Bad Request: queryStringParameters Missing')
        return False
    
    queryStringParameters = event['queryStringParameters']
    
    if 'store_id' not in queryStringParameters:
        response['statusCode'] = 400
        response['body'] = json.dumps('Bad Request: store_id Key Missing')
        return False

    
    return True
    
    
    