import psycopg2
from secrets import USERNAME, PASSWORD, DATABASE


def test_db():
    try:
        conn = psycopg2.connect(user=USERNAME,
                                  password=PASSWORD,
                                  host="save.cdc2z2pnuvzu.us-east-1.rds.amazonaws.com",
                                  port="5432",
                                  database=DATABASE)
        cursor = conn.cursor()
        return cursor
    except:
        return None

# ('id', 'store_id', 'name', 'category', 'quantity', 'actual_price', 'discounted_price', 'discounted_reason', 'available_date', 'image_link', 'created_at', 'modified_at')