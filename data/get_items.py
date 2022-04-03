import requests
import time
import csv
import os

# create csv file
header = ['product_id', 'name', 'category', 'price', 'images']
if not os.path.exists('items.csv'):
	with open('items.csv', 'a', encoding='UTF8', newline='') as f:
	    writer = csv.writer(f)
	    writer.writerow(header)

# product ids
unique_ids = set()

with open('fairprice_apis.txt', 'r') as file:
	links = file.readlines()
	for link in links:	
		# Preprocess string
		link = link.split('\n')[0]
		
		# Extracting num of pages
		time.sleep(5)
		data = requests.get(link).json()
		pages = data['data']['pagination']['total_pages']

		# Track current page
		curr_page = 2

		# Extract images from every page in category
		all_prods = []
		for page in range(2, pages+1):

			link = link.replace("page={}".format(curr_page), "page={}".format(page))
			curr_page = page

			print('Extracting info from...{}'.format(link))
			print()
			time.sleep(5)

			r = requests.get(link)
			data = r.json()
			products = data['data']['product']
			
			for prod in products:
				prod_id = prod['id']
				if prod_id in unique_ids:
					continue
				else:
					unique_ids.add(prod_id)

				prod_name = prod['name']				
				prod_category = [prod['primaryCategory']['name']]
				if 'parentCategory' in prod['primaryCategory']:
					prod_category.append(prod['primaryCategory']['parentCategory']['name'])
					if 'parentCategory' in prod['primaryCategory']['parentCategory']:
						prod_category.append(prod['primaryCategory']['parentCategory']['parentCategory']['name'])
				
				prod_price = prod['storeSpecificData'][0]['mrp']
				prod_image_link = prod['images']
				all_prods.append([prod_id, prod_name, prod_category, prod_price, prod_image_link])
		
		print('-----------------------------------')
		
		with open('items.csv', 'a', encoding='UTF8', newline='') as f:
		    writer = csv.writer(f)
		    writer.writerows(all_prods)

		print('Products for current category: {}'.format(len(all_prods)))