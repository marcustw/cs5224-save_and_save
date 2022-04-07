import psycopg2

def test_db():
    try:
        conn = psycopg2.connect(user="postgres",
                                  password="savensave",
                                  host="save.cdc2z2pnuvzu.us-east-1.rds.amazonaws.com",
                                  port="5432",
                                  database="save")
        cursor = conn.cursor()
        return cursor
    except:
        return None

