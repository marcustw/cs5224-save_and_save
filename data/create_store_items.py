import numpy as np
import os
import pandas as pd
from datetime import date, timedelta
from random import choices

def generate_discount_reason(row):
	if row['discounted'] >= 0.8:
		return 'EXPIRING SOON'
	elif row['discounted'] >= 0.5:
		return 'CLEARING STOCK'
	elif row['discounted'] >= 0.2:
		return 'SEASONAL OFFER'
	else:
		return 'NORMAL DISCOUNT'

def clean_name(row):
	name = row['name']
	name = name.replace('\'', '-')
	name = name.replace('\'\'', '-')
	return name

def clean_category(row):
	cat = row['category']
	cat = cat.split(',')[-1]
	cat = cat.replace('\'', '')
	cat = cat.replace('[', '')
	cat = cat.replace(']', '')
	return cat

def clean_image_link(row):
	link = row['image_link']
	link = link.split(',')[0]
	link = link.replace('\'', '')
	link = link.replace('[', '')
	link = link.replace(']', '')
	return link

# read csv
file_name = 'items_masterlist.csv'
df = pd.read_csv(file_name)

# stock from 1 - 200
df['quantity'] = np.random.randint(1, 200, size=len(df))

# maximum discount = 0.8
df['discounted'] = np.random.random_sample((len(df),))
df['discounted_reason'] = df.apply(lambda row : generate_discount_reason(row), axis=1) 
df['discounted'] = (0.8) * df['discounted']

# new price
df['discounted_price'] = (df['discounted'] * df['actual_price']).round(2)

# available till
curr_date = date.today()
dates = [curr_date + timedelta(days=i) for i in range(1,15)]
random_dates = choices(dates, k=len(df))
df['available_date'] = random_dates

# category
df['category'] = df.apply(lambda row : clean_category(row), axis=1) 

# image_link
df['image_link'] = df.apply(lambda row : clean_image_link(row), axis=1) 

# name
df['name'] = df.apply(lambda row : clean_name(row), axis=1)

# cleaning up
df = df[['id', 'name', 'category', 'quantity', 'actual_price', 'discounted_price', 'discounted_reason', 'available_date', 'image_link']]

# sample and output csv
supermarkets = ['ntuc_fairprice', 'giant', 'sheng_siong', 'cold_storage', 'lee_and_lee', 'marketplace', 'redmart', 'mustafa', 'little_farms', 'ryan_grocery']

num_items = df.shape[0]
iteration = 0
index = 0

while index < num_items:
	iteration += 1
	for supermarket in supermarkets:
		df_store = df.loc[index:index+50]
		df_store.to_csv('{}_{}.csv'.format(supermarket, iteration), index=False)
		index += 51