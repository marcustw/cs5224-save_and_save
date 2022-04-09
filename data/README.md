# Data Augmentation

There were mainly three steps that were undertaken in data generation and augmentation for Save & Save. 

1. Manually getting weblinks for product categories from NTUC's website. These links are saved in the `fairprice_apis.txt` file.

2. Next `get_items.py` makes REST API calls to the relevant weblinks saved in the `fairprice_apis.txt` file and saves the output - product information - into a CSV file named `items.csv` file.

3. Next, `create_store_items.py` breaks the `items.csv` file into smaller CSV files to augment product listings from multiple supermarkets. Additional information such as `quantity` and `offer expiry date` was also added to these smaller CSV files.

With these steps, the CSV files that were to be uploaded to the platform were in the pre-defined format for bulk upload. 