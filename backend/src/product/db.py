import psycopg2
from secrets import USERNAME, PASSWORD, DATABASE

def test_db():
    conn = psycopg2.connect(user=USERNAME,
                              password=PASSWORD,
                              host="save.cdc2z2pnuvzu.us-east-1.rds.amazonaws.com",
                              port="5432",
                              database=DATABASE)
    cursor = conn.cursor()
    return cursor, conn
