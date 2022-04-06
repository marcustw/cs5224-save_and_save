import time

table_name = 'customer'

column_names = ["id", "authorized_to_sell", "username",
    "password", "name", "address", "contact_no", "mail_id",
    "first_name", "last_name", "created_at", "modified_at"]

def delete_customer(cursor, customer_id):
    cursor.execute("DELETE FROM {} WHERE id=\'{}\'".format(table_name, customer_id))
    return {
        'message': 'Delete customers with id={}'.format(customer_id),
    }

def get_customer(cursor, customer_id):
    cursor.execute("SELECT * FROM {} WHERE id=\'{}\'".format(table_name, customer_id))
    customer = cursor.fetchone()
    if customer is None:
        return {
            'message': 'Failed to find customer with id={}'.format(customer_id),
            'payload': customer,
        }
    payload = {}
    for i in range(len(column_names)):
        payload[column_names[i]] = customer[i]
    return {
        'message': 'Get customer with id={}'.format(customer_id),
        'payload': payload,
    }


def create_customer(cursor, **customer_info):
    command_part_2=customer_info
    try:
        customer_id = customer_info["id"]
        authorized_to_sell = customer_info["authorized_to_sell"]
        username = customer_info["username"]
        password = customer_info["password"]
        name=customer_info["name"]
        address = customer_info["address"]
        contact_no = customer_info["contact_no"]
        mail_id = customer_info["mail_id"]
        first_name = customer_info["first_name"]
        last_name = customer_info["last_name"]
        created_at = int(time.time())
        command_part_1 = "INSERT INTO {} ({}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}) ".format(table_name, 'id', 'authorized_to_sell', 'username', 'password', 'name', 'address', 'contact_no', 'mail_id', 'first_name', 'last_name', 'created_at', 'modified_at')
        command_part_2 = "VALUES (\'{}\',{},\'{}\',\'{}\',\'{}\',\'{}\',{},\'{}\',\'{}\',\'{}\',{},{})".format(customer_id, authorized_to_sell, username, password, name, address, contact_no, mail_id, first_name, last_name, created_at, created_at)
        sql_query = command_part_1 + command_part_2
        cursor.execute(sql_query)
        return {
            "message": "Added Customer into table",
            "payload": command_part_2,
        }
    except:
        raise ValueError("Error adding customer to table, values={}".format(command_part_2))
    
def edit_customer(cursor, **customer_info):
    msg = "error"
    if "id" in customer_info.keys():
        set_values = ""
        customer_id = None
        for key, value in customer_info.items():
            if key not in column_names:
                raise ValueError("Error updating customer, key={} not in table column".format(key))
            if key != "id":
                if type(value) is str:
                    set_values += str(key) + " = \'" + value + "\', "
                else:
                    set_values += str(key) + " = " + str(value) + ", "
            else:
                customer_id = value
        modified_at = int(time.time())
        set_values += "modified_at = {}".format(modified_at)
        sql_query = "UPDATE {} SET {} WHERE id=\'{}\';".format(table_name, set_values, customer_id)
        try:
            cursor.execute(sql_query)
            return {
                "message": "Update customer with id={}".format(customer_id),
                "payload": "{} for id={} at time={}".format(set_values, customer_id, modified_at),
            }
        except:
            raise ValueError("SQL Error updating customer, check item types, sql={}".format(sql_query, customer_id))
        
    raise ValueError("Error updating customer, id not present")