import psycopg2
from secrets import USERNAME, PASSWORD, DATABASE, DB_HOST, DB_PORT

def test_db():
    try:
        conn = psycopg2.connect(user=USERNAME,
                                password=PASSWORD,
                                host=DB_HOST,
                                port=DB_PORT,
                                database=DATABASE)
        cursor = conn.cursor()
        return cursor
    except:
        return None
