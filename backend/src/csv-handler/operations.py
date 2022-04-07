import json
import pandas as pd
from io import StringIO
import boto3
import psycopg2
import time
import datetime
from botocore.client import Config
import uuid

BUCKET_NAME = "save-and-save-csvs"

"""
Operations
"""

def handle_upload_csv(event, response):
    print("handle_upload_csv")
    user_id = str(event['queryStringParameters']['store_id'])
        
    binary_file = event['body']
    df = pd.read_csv(StringIO(binary_file))
    valid_csv, issue = validate_csv(df)
    
    if not valid_csv:
        response['statusCode'] = 400
        response['body'] = json.dumps(issue)
        return
    
    conn, cursor = set_up_db()
    valid_db_operation, issue = add_products_to_db(df, user_id, cursor)
    
    if not valid_db_operation:
        response['statusCode'] = 400
        response['body'] = json.dumps(issue)
        return
    else:
        conn.commit()
        add_csv_to_s3(df, user_id)
    
    response['statusCode'] = 200
    response['body'] = json.dumps('Processed CSV!')
    print("handle_upload_csv - done")
    
    

"""
Helpers
"""

def validate_csv(df):
    print("validate_csv")
    # check if col headers are of certain size
    # check if col headers match with template
    column_names = ["id", "name", "category", "quantity", "actual_price", "discounted_price", "discounted_reason", "available_date", "image_link"]
    
    if len(df.columns) != len(column_names):
        return False, "Bad Request: Incorrect Number of Columns"
    
    return True, None

def add_products_to_db(df, user_id, cursor):
    print("add_products_to_db")
    for index, row in df.iterrows():
        # extract from csv
        id = int(row[0])
        name = str(row[1])
        category = str(row[2])
        quantity = int(row[3])
        actual_price = float(row[4])
        discounted_price = float(row[5])
        discounted_reason = str(row[6])
        
        year, month, day = str(row[7]).split('-')
        available_date = int(datetime.datetime(int(year), int(month), int(day)).timestamp())

        image_link = str(row[8])
        store_id = user_id
        created_at = int(datetime.datetime.now().timestamp())
        modified_at = created_at
        
        # check if listing exists
        product_id = row['id']
        command = "select count(id) from product_listing where id={}".format(product_id)
        cursor.execute(command)
        num_listings = int(cursor.fetchone()[0])
        print(product_id)
        if num_listings != 0:
            # get record created_at time
            command = "select created_at from product_listing where id={}".format(product_id)
            cursor.execute(command)
            created_at = int(cursor.fetchone()[0])

            # delete current record
            command = "delete from product_listing where id={}".format(product_id)
            cursor.execute(command)

        # create new record
        command_part_1 = "INSERT INTO product_listing ({}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}) ".format('id', 'store_id', 'name', 'category', 'quantity', 'actual_price', 'discounted_price', 'discounted_reason', 'available_date', 'image_link', 'created_at', 'modified_at')
        command_part_2 = "VALUES ({}, \'{}\', \'{}\', \'{}\', {}, {}, {}, \'{}\', \'{}\', \'{}\', \'{}\', \'{}\');".format(id, store_id, name, category, quantity, actual_price, discounted_price, discounted_reason, available_date, image_link, created_at, modified_at)
        print(command_part_1 + command_part_2)
        cursor.execute(command_part_1 + command_part_2)

    return True, None

def add_csv_to_s3(df, user_id):
    print("add_csv_to_s3")
    # generate file name
    now = int(datetime.datetime.now().timestamp())
    csv_id = str(uuid.uuid1().int >> 96)
    filename = '{}_{}_{}.csv'.format(user_id, now, csv_id)

    # put data into buffer
    csv_buffer = StringIO()
    df.to_csv(csv_buffer)
    
    # transform buffer to file and save it in S3
    try:
        config = Config(connect_timeout=2, retries={'max_attempts': 0})
        client = boto3.client('s3', config=config)
        client.put_object(Body=csv_buffer.getvalue(), Bucket=BUCKET_NAME, Key=filename)
    except:
        pass
    return True
    
def set_up_db():
    conn = psycopg2.connect(user="postgres",
                              password="savensave",
                              host="save.cdc2z2pnuvzu.us-east-1.rds.amazonaws.com",
                              port="5432",
                              database="save")
    cursor = conn.cursor()
    
    return conn, cursor
    
def count_rows_db():
    conn = None
    conn = psycopg2.connect(user="postgres",
                              password="savensave",
                              host="save.cdc2z2pnuvzu.us-east-1.rds.amazonaws.com",
                              port="5432",
                              database="save")
    cur = conn.cursor()
    # create table one by one
    cur.execute("SELECT count(id) from product_listing;")
    ans = cur.fetchone()
    print(ans)
    # close communication with the PostgreSQL database server
    cur.close()
