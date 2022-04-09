import psycopg2
import json
import time

table_name = 'product_listing'

column_names = ["id", "store_id", "name", "category", "quantity", 
"actual_price", "discounted_price", "discounted_reason", "available_date",
"image_link", 'created_at', 'modified_at']

def delete_item(cursor, product_id):
    cursor.execute("DELETE FROM {} WHERE id={}".format(table_name, str(product_id)))
    return {
        'message': 'Delete product listing with id={}'.format(product_id),
    }

def get_item(cursor, product_id):
    cursor.execute("SELECT * FROM {} WHERE id={}".format(table_name, str(product_id)))
    product = cursor.fetchone()
    if product is None:
        return {
            'message': 'Failed to find product listing with id={}'.format(product_id),
            'payload': product,
        }
    payload = {}
    for i in range(len(column_names)):
        payload[column_names[i]] = product[i]
    return {
        'message': 'Get product listing with id={}'.format(product_id),
        'payload': payload,
    }

def create_item(cursor, **product_info):
    sql_query = ""
    try:
        product_id=product_info["id"]
        store_id=product_info["store_id"]
        name=product_info["name"]
        category=product_info["category"]
        quantity=product_info["quantity"]
        actual_price=product_info["actual_price"]
        discounted_price=product_info["discounted_price"]
        discounted_reason=product_info["discounted_reason"]
        available_date=product_info["available_date"]
        image_link=product_info["image_link"]
        created_at = int(time.time())
        command_part_1 = "INSERT INTO product_listing ({}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}) ".format('id', 'store_id', 'name', 'category', 'quantity', 'actual_price', 'discounted_price', 'discounted_reason', 'available_date', 'image_link', 'created_at', 'modified_at')
        command_part_2 = "VALUES ({pid}, \'{sid}\', \'{name}\', \'{category}\', {quantity}, {actual_price}, {discounted_price}, \'{discounted_reason}\', \'{available_date}\', \'{image_link}\', {created_at}, {modified_at});".format(pid=str(product_id), sid=str(store_id), name=name, category=category, quantity=quantity, actual_price=actual_price, discounted_price=discounted_price, discounted_reason=discounted_reason, available_date=available_date, image_link=image_link, created_at=created_at, modified_at=created_at)
        sql_query = command_part_1 + command_part_2
        cursor.execute(sql_query)
        cursor.execute("SELECT 1 FROM product_listing WHERE id={}".format(product_id))
        product = cursor.fetchone()
        payload = {}
        for i in range(len(column_names)):
            payload[column_names[i]] = product[i]
        return {
            "message": "Added product into table",
            "payload": payload,
        }
    except:
        raise ValueError("Error adding product to table, query={}".format(sql_query))
    
def edit_item(cursor, **product_info):
    msg = "error"
    if "id" in product_info.keys():
        set_values = ""
        product_id = None
        for key, value in product_info.items():
            if key not in column_names:
                raise ValueError("Error updating item, key={} not in table column".format(key))
            if key != "id":
                if type(value) is str: 
                    set_values += str(key) + " = \'" + value + "\', "
                else:
                    set_values += str(key) + " = " + str(value) + ", "
            else:
                product_id = value
        modified_at = int(time.time())
        set_values += "modified_at={}".format(modified_at)
        sql_query = "UPDATE product_listing SET {} WHERE id={}".format(set_values, product_id)
        try:
            cursor.execute(sql_query)
            cursor.execute("SELECT * FROM product_listing WHERE id={} LIMIT 1;".format(product_id))
            product = cursor.fetchone()
            payload = {}
            for i in range(len(column_names)):
                payload[column_names[i]] = product[i]
            return {
                "message": "Update item with id={}".format(product_id),
                "payload": payload,
            }
        except:
            raise ValueError("SQL Error updating item, check item types, sql = {} for id={}".format(sql_query, product_id))
        
    raise ValueError("Error updating item, id not present")
