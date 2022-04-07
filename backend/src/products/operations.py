import psycopg2
import json
import datetime

table_name = "product_listing"
current_time = int(datetime.datetime.now().timestamp())

def deleteAll(cursor):
    # DELETE ALL
    cursor.execute("DELETE FROM {};".format(table_name))
    return { "message": "Deleted all products" }

available_orderbys = ['store_id', 'name', 'category', 'quantity', 'actual_price',
'discounted_price', 'discounted_reason', 'available_date', 'image_link', 
'created_at', 'modified_at']

column_names = ["id", "store_id", "name", "category", "quantity", 
"actual_price", "discounted_price", "discounted_reason", "available_date",
"image_link", 'created_at', 'modified_at']

def getAll(cursor, offset=0, limit=10, orderby=None, keyword=None, store_id=None):
    # GET ALL PRODUCTS
    sql_query = ""
    where_clause = " WHERE (quantity > 0 and available_date > {})".format(current_time)
    search_keyword = " and (name ~* \'{}\')".format(keyword) if keyword is not None else ""
    search_store = " and (store_id = \'{}\')".format(store_id) if store_id is not None else ""
    if (keyword is not None and store_id is not None):
        where_clause += search_keyword + search_store
    else:
        if keyword is not None:
            where_clause += search_keyword
        else:
            where_clause += search_store
    if not orderby:
        sql_query = "SELECT * FROM {}{} offset {};".format(table_name, where_clause, offset, limit)
    else:
        if orderby not in available_orderbys:
            return { "message": "Get alll products unavailable: unsupported orderby" }
        sql_query = "SELECT * FROM {}{} order by {} offset {};".format(table_name, where_clause, orderby, offset, limit)
    print(sql_query)
    cursor.execute(sql_query)
    products = cursor.fetchall()
    if products is None:
        return { 
            "message": "No more products with offset={} & limit={} & orderby".format(offset, limit),
            "products": products
            }
    payload = []
    for product in products:
        if (len(payload) < int(limit)):
            prod = {}
            for i in range(len(column_names)):
                prod[column_names[i]] = product[i]
            payload.append(prod)
    return { 
        "message": "Get products with offset={} & limit={} & orderby".format(offset, limit),
        "products": payload,
        "count": len(products)
        }