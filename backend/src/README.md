# Save & Save Backend

## Configurations
1. Set up Postgres Amazon RDS Database
2. Add a file `secrets.py` with required secret environment variables `USERNAME, PASSWORD, DATABASE, DB_HOST, DB_PORT`
3. Zip each microservice code
4. Create AWS Lambda for each microservice and upload the zipped code
5. Configure your psycopg2 layer and pandas layer