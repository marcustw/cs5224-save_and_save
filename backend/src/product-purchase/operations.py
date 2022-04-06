import time

table1 = 'purchase'
table2 = 'purchase_product'

col1 = ['id', 'customer_id', 'total_price', 'created_at', 'modified_at']
col2 = ['purchase_id', 'product_id', 'quantity', 'status']

def get_purchase_product(cursor, store_id=None, customer_id=None, offset=0, limit=10):
    
    print("get_purchase_product")
    limit = int(limit)
    offset = int(offset)
    
    if customer_id is not None:
        
        print("customer_id is not None")
        
        new_statement = """SELECT P.id, PL.id, PL.name, PL.discounted_price, PP.quantity, PP.status, PL.store_id from product_listing PL, purchase P, purchase_product PP
        WHERE P.customer_id=\'{}\' and P.id=PP.purchase_id and PP.product_id=PL.id and PP.status!='2' ORDER BY P.id
        """.format(customer_id)
        
        try:
            cursor.execute(new_statement)
        except Exception as err:
            print(err)

        purchase_products_by_customer = cursor.fetchall()
        purchase_dict = {}
        
        set_to_collect_purchase_ids_to_offset = set()
        
        for product in purchase_products_by_customer:
            purchase_id = product[0]

            if len(set_to_collect_purchase_ids_to_offset) < offset or (len(set_to_collect_purchase_ids_to_offset) == offset and purchase_id in set_to_collect_purchase_ids_to_offset):
                set_to_collect_purchase_ids_to_offset.add(purchase_id)
                continue
            
            if (len(purchase_dict.keys()) < limit or (len(purchase_dict.keys()) <= limit and purchase_id in purchase_dict)):

                if purchase_id not in purchase_dict:
                    purchase_dict[purchase_id] = {
                        "products": [],
                        "total_cost": 0
                    }
                
                curr_purchase_prod = {
                    'product_id': product[1],
                    'product_name': product[2],
                    'product_price': product[3],
                    'quantity': product[4],
                    'status': product[5],
                    'store_id': product[6]
                }
                
                purchase_dict[purchase_id]['products'].append(curr_purchase_prod)
                purchase_dict[purchase_id]['total_cost'] += curr_purchase_prod['product_price']
        
        return {
            'message': 'Get all purchase products by customer with customer_id={}'.format(customer_id),
            'payload': purchase_dict,
            'count': len(purchase_dict),
        }
    elif store_id is not None:
        
        print("store_id is not None")

        new_statement = """SELECT P.id, PL.id, PL.name, PL.discounted_price, PP.quantity, PP.status, PL.store_id from product_listing PL, purchase P, purchase_product PP
        WHERE PL.store_id=\'{}\' and PP.product_id=PL.id and P.id=PP.purchase_id and PP.status!='2' ORDER BY P.id""".format(store_id)
        
        try:
            cursor.execute(new_statement)
        except Exception as err:
            print(err)
        
        purchase_products_from_store = cursor.fetchall()
        purchase_dict = {}

        set_to_collect_purchase_ids_to_offset = set()
        
        for product in purchase_products_from_store:
            
            purchase_id = product[0]

            if len(set_to_collect_purchase_ids_to_offset) < offset or (len(set_to_collect_purchase_ids_to_offset) == offset and purchase_id in set_to_collect_purchase_ids_to_offset):
                set_to_collect_purchase_ids_to_offset.add(purchase_id)
                continue
            
            if (len(purchase_dict.keys()) < limit or (len(purchase_dict.keys()) <= limit and purchase_id in purchase_dict)):

                print(purchase_id)
                
                if purchase_id not in purchase_dict:
                    purchase_dict[purchase_id] = {
                        "products": [],
                        "total_cost": 0
                    }

                curr_purchase_prod = {
                    'product_id': product[1],
                    'product_name': product[2],
                    'product_price': product[3],
                    'quantity': product[4],
                    'status': product[5],
                    'store_id': product[6]
                }

                purchase_dict[purchase_id]['products'].append(curr_purchase_prod)
                purchase_dict[purchase_id]['total_cost'] += curr_purchase_prod['product_price']

        return {
            'message': 'Get all purchase products from store_id=\'{}\''.format(store_id),
            'payload': purchase_dict,
            'count': len(purchase_dict.keys()),
        }
    else:
        return {
            'message': 'Failed to get purchase_product because no store_id or customer_id provided',
            'payload': None,
        }

def edit_purchase_product(cursor, purchase_id, store_id, status):
    print("edit_purchase_product")
    purchase_id = int(purchase_id)

    try:
        first_statement = """SELECT PL.id FROM product_listing PL, purchase_product PP, purchase P
        WHERE PP.purchase_id={} and PP.product_id=PL.id and PL.store_id=\'{}\'""".format(purchase_id, store_id)
        
        cursor.execute(first_statement)
        product_ids = cursor.fetchall()
        for prod_id in product_ids:
            prod_id = prod_id[0]
            cursor.execute("UPDATE purchase_product SET status=\'{}\' WHERE purchase_id={} and product_id={}".format(status, purchase_id, prod_id))
        return {
            "message": "Updated status={} for products with purchase_id={} and store_id=\'{}\'".format(status, purchase_id, store_id)
        }
    except:
        raise ValueError("Error updating purchase product status")
