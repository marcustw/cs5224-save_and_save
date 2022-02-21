import numpy as np
import os
import pandas as pd
from datetime import date, timedelta
from random import choices

supermarkets = ['ntuc_fairprice', 'giant', 'sheng_siong', 'cold_storage', 'lee_and_lee', 'marketplace', 'redmart', 'mustafa', 'little_farms', 'ryan_grocery']

# read csv
file_name = 'items_masterlist.csv'
df = pd.read_csv(file_name)

# stock from 1 - 200
df['available_stock'] = np.random.randint(1, 200, size=len(df))

# maximum discount = 0.8
df['discounted'] = np.random.random_sample((len(df),))
df['discounted'] = (0.8) * df['discounted']

# new price
df['new_unit_price'] = (df['discounted'] * df['price']).round(2)

# available till
curr_date = date.today()
dates = [curr_date + timedelta(days=i) for i in range(1,15)]
random_dates = choices(dates, k=len(df))
df['available_till'] = random_dates

# cleaning up
df.rename(columns={"price": "original_price"}, inplace=True)
df = df[['product_id', 'name', 'category', 'available_stock', 'new_unit_price', 'original_price', 'available_till', 'images']]

# sample and output csv
for supermarket in supermarkets:
	df_store = df.sample(n=1000)
	df_store.to_csv('{}.csv'.format(supermarket))