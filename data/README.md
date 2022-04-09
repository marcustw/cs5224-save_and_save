# Data Augmentation

There were mainly three steps in data generation and augmentation for Save & Save. 

1. Getting weblinks for product categories from NTUC's website. These links are saved in the `fairprice_apis.txt` file.

2. Next `get_items.py` makes REST API calls to the relevant weblinks saved in the `fairprice_apis.txt` file and saves the output - product information - into a CSV file named `items.csv` file.

3. Next, `create_store_items.py` breaks the `items.csv` file into smaller CSV files to augment product listings from multiple supermarkets. Additional information such as `quantity` and `offer expiry date` is also added to these smaller CSV files.

4. The smaller CSV files are now in the pre-defined format for bulk upload.