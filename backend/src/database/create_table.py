import psycopg2
from psycopg2 import Error
from secrets import USERNAME, PASSWORD, DATABASE, DB_HOST, DB_PORT


def create_tables():
    delete_commands = (
        """
        DROP TABLE customer CASCADE;
        """,
        """
        DROP TABLE product_listing CASCADE;
        """,
        """
        DROP TABLE purchase CASCADE;
        """,
        """
        DROP TABLE purchase_product CASCADE;
        """

    )
    commands = (
        """
        CREATE TABLE customer(
            id VARCHAR(255) PRIMARY KEY,
            authorized_to_sell boolean NOT NULL,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(255) NOT NULL,
            contact_no INTEGER NOT NULL,
            mail_id VARCHAR(255) NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name  VARCHAR(255) ,
            created_at INTEGER NOT NULL,
            modified_at INTEGER NOT NULL
        )
        """,
        """ CREATE TABLE product_listing (
                id INTEGER PRIMARY KEY,
                store_id VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(255) NOT NULL,
                quantity INTEGER NOT NULL,
                actual_price FLOAT NOT NULL,
                discounted_price FLOAT NOT NULL,
                discounted_reason VARCHAR(255) NOT NULL,
                available_date INTEGER NOT NULL,
                image_link VARCHAR(255) NOT NULL,
                created_at INTEGER NOT NULL,
                modified_at INTEGER NOT NULL,
                FOREIGN KEY (store_id)
                REFERENCES customer (id)
                ON UPDATE CASCADE ON DELETE CASCADE
                )
        """,
        """
        CREATE TABLE purchase (
                id INTEGER PRIMARY KEY,
                customer_id VARCHAR(255) NOT NULL,
                total_price FLOAT NOT NULL,
                created_at INTEGER NOT NULL,
                modified_at INTEGER NOT NULL,
                FOREIGN KEY (customer_id)
                REFERENCES customer (id)
                ON UPDATE CASCADE ON DELETE CASCADE
        )
        """,
        """
        CREATE TABLE purchase_product (
                purchase_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                status VARCHAR(255) NOT NULL,
                FOREIGN KEY (purchase_id)
                    REFERENCES purchase (id)
                    ON UPDATE CASCADE ON DELETE CASCADE,
                FOREIGN KEY (product_id)
                    REFERENCES product_listing (id)
                    ON UPDATE CASCADE ON DELETE CASCADE
    
        )
        """)
        
    conn = None
    try:
        # connect to the PostgreSQL server
        conn = psycopg2.connect(user=USERNAME,
                                  password=PASSWORD,
                                  host=DB_HOST,
                                  port=DB_PORT,
                                  database=DATABASE)
        cur = conn.cursor()
        # delete all relevant tables
        for command in delete_commands:
            cur.execute(command)

        # create table one by one
        for command in commands:
            cur.execute(command)
        # close communication with the PostgreSQL database server
        cur.close()
        # commit the changes
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()


if __name__ == '__main__':
    create_tables()

