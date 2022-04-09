import json
import pandas as pd
from io import StringIO
import psycopg2
import time
import datetime
import uuid

"""
Operations
"""

def handle_post_purchase(event, response):
    payload = None

    try:
        payload =json.loads(event['body'])
    except:
        pass
    if not payload:
        response['statusCode'] = 400
        response['body'] = json.dumps('Error in body, empty payload')
        return
    elif 'customer_id' not in payload or 'total_price' not in payload or 'products' not in payload:
        response['statusCode'] = 400
        response['body'] = json.dumps('Error in body, incomplete information provided - customer_id, total_price or products key/value is missing')
        return
    elif not payload['products']:
        response['statusCode'] = 400
        response['body'] = json.dumps('Error in body, given empty products list.')
        return
    
    conn, cursor = set_up_db()
    
    ## Prepare create_purchase statement
    id = int(str(uuid.uuid1().int)[0:8])
    customer_id = payload['customer_id']
    total_price = int(payload['total_price'])
    created_at = int(datetime.datetime.now().timestamp())
    modified_at = created_at

    command_part_1 = "INSERT INTO purchase ({}, {}, {}, {}, {}) ".format('id', 'customer_id', 'total_price', 'created_at', 'modified_at')
    command_part_2 = "VALUES ({}, \'{}\', {}, {}, {})".format(id, customer_id, total_price, created_at, modified_at)
    
    insert_purchase_statement = command_part_1 + command_part_2
    print(insert_purchase_statement)

    ## Execute createpurchase statement
    try:
        cursor.execute(insert_purchase_statement)
    except Exception as err:
        print(err)
        response['statusCode'] = 400
        response['body'] = json.dumps('Server error in creating purchase')
        return
    
    # Prepare and execute insert_purchase_product statements
    for prod_id, quantity in payload["products"].items():
        purchase_product_info = {}
        purchase_product_info['purchase_id'] = id
        purchase_product_info['product_id'] = int(prod_id)
        purchase_product_info['quantity'] = quantity
        purchase_product_info['status'] = 0
        print(purchase_product_info)
        success = create_purchase_product(cursor, purchase_product_info)
        if not success:
            response['statusCode'] = 400
            response['body'] = json.dumps('Server error in inserting purchase product')
            return
            
    
    conn.commit()
    response['statusCode'] = 200
    response['body'] = json.dumps({
        "purchase_id": id
    })
    return

        
"""
Helpers
"""
def create_purchase_product(cursor, purchase_product_info):
    success = False
    try:
        # add product to purchase product
        product_id = purchase_product_info['product_id']
        purchase_id = purchase_product_info['purchase_id']
        quantity = int(purchase_product_info['quantity'])
        status = purchase_product_info['status']
        command_part_1 = "INSERT INTO {} ({}, {}, {}, {}) ".format("purchase_product", 'product_id', 'purchase_id', 'quantity', 'status')
        command_part_2 = "VALUES (\'{}\', \'{}\', {}, \'{}\');".format(product_id, purchase_id, quantity, status)
        sql_query = command_part_1 + command_part_2
        print(sql_query)
        cursor.execute(sql_query)
        
        # reduce quantity
        sql_query = "SELECT quantity from product_listing where id={} limit 1;".format(product_id)
        print(sql_query)
        cursor.execute(sql_query)
        current_quantity = cursor.fetchone()[0]
        if current_quantity == 0 or current_quantity < quantity:
            success = False
        else:
            new_quantity = current_quantity - quantity
            sql_query = "UPDATE product_listing SET quantity={} WHERE id={};".format(new_quantity, product_id)
            print(sql_query)
            cursor.execute(sql_query)
            success = True
    except Exception as err:
        print(err)
        success = False

    return success

def set_up_db():
    conn = psycopg2.connect(user=USERNAME,
                              password=PASSWORD,
                              host="save.cdc2z2pnuvzu.us-east-1.rds.amazonaws.com",
                              port="5432",
                              database=DATABASE)
    cursor = conn.cursor()
    
    return conn, cursor
    
def count_rows_db():
    conn = None
    conn = psycopg2.connect(user=USERNAME,
                              password=PASSWORD,
                              host="save.cdc2z2pnuvzu.us-east-1.rds.amazonaws.com",
                              port="5432",
                              database=DATABASE)
    cur = conn.cursor()
    # create table one by one
    cur.execute("SELECT count(id) from product_listing;")
    ans = cur.fetchone()
    print(ans)
    # close communication with the PostgreSQL database server
    cur.close()
