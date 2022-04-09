import psycopg2
import json
import operator
import time 
import datetime  




def getPopularProducts(cursor,type, customer_id, start_date, end_date):
    # GET POPULAR PRODUCTS
    # Popular product query
    popular_product_query = " SELECT   product_listing.name, sum(purchase_product.quantity) FROM purchase_product  JOIN product_listing ON purchase_product.product_id = product_listing.id JOIN purchase ON purchase_product.purchase_id = purchase.id WHERE (store_id = '{}' and {} <= purchase.created_at and {}>= purchase.created_at) group by product_listing.name order by sum(purchase_product.quantity) desc limit 10; ".format(customer_id,start_date,end_date)
    cursor.execute(popular_product_query)
    products = cursor.fetchall()
    if products is None:
        return { 
            "message": "No Popular Prodcuts Available for {} between {} and {}".format(customer_id,start_date,end_date),
            "products": products
            }
    payload = products
    
    return { 
        "message": "Popular Prodcuts Available for {} between {} and {}".format(customer_id,start_date,end_date),
        "products": payload,
        "count": len(products)
        }
        
def getPopularTime(cursor, type, customer_id, start_date, end_date):
    # GET POPULAR PRODUCTS
    # Popular product query
    popular_time_query = " SELECT   purchase.created_at FROM purchase_product  JOIN product_listing ON purchase_product.product_id = product_listing.id  JOIN purchase ON purchase_product.purchase_id = purchase.id  WHERE (store_id = 'viki' and {} <= purchase.created_at and {}>= purchase.created_at)  group by purchase.created_at order by count(purchase.created_at) desc limit 3; ".format(start_date,end_date)
    cursor.execute(popular_time_query)
    times = cursor.fetchall()
    
    date_time = []
    for time in times:
        date_time.append(datetime.datetime.fromtimestamp( time[0]))
       
    keys = [0,1,2,3,4,5,6,7,8,9,10,11]
    time_ranges =  {k: 0 for k in keys}
       
    for date in date_time:
        t = str(date.time())[:2]
        if (int(t) < 2):
           time_ranges[0] = time_ranges[0] + 1
        elif (int(t) >= 2 and int(t) < 4):
           time_ranges[1] = time_ranges[1] + 1
        elif(int(t) >= 4 and int(t) < 6):
           time_ranges[2] = time_ranges[2] + 1
        elif(int(t) >= 6 and int(t) < 8):
           time_ranges[3] = time_ranges[3] + 1
        elif(int(t) >= 8 and int(t) < 10):
           time_ranges[4] = time_ranges[4] + 1
        elif(int(t) >= 10 and int(t) < 12):
           time_ranges[5] = time_ranges[5] + 1
        elif(int(t) >= 12 and int(t) < 14):
           time_ranges[6] = time_ranges[6] + 1
        elif(int(t) >= 14 and int(t) < 16):
           time_ranges[7] = time_ranges[7] + 1
        elif(int(t) >= 16 and int(t) < 18):
           time_ranges[8] = time_ranges[8] + 1
        elif(int(t) >= 18 and int(t) < 20):
           time_ranges[9] = time_ranges[9] + 1
        elif(int(t) >= 20 and int(t) < 22):
           time_ranges[10] = time_ranges[10] + 1
        elif(int(t) >= 22 and int(t) <= 24):
           time_ranges[11] = time_ranges[11] + 1
           
    sorted_time_ranges = sorted(time_ranges.items(), key=operator.itemgetter(1), reverse=True)
    
    popular_time = []
    for r in sorted_time_ranges:
        if r[1]!= 0:
            popular_time.append((r[0],r[1]))
            
    #time_range_map = create_time_range_mapping()
                    
    response = []
    for pt in popular_time:
        lr, hr = get_time(pt[0])
        response.append((lr,hr,pt[1]))
    
    if response is None:
        return { 
            "message": "No products were bought from {} between {} and {}".format(customer_id,start_date,end_date),
            "products": products
            }
    payload = response
    
    return { 
        "message": "Popular timing for {} between {} and {}".format(customer_id,start_date,end_date),
        "products": payload,
        "count": len(response)
        }
  
'''       
def create_time_range_mapping():
    pattern = '%H:%M:%S'
    times = ["0:0:0","2:0:0","4:0:0","6:0:0","8:0:0","10:0:0","12:0:0","14:0:0","16:0:0","18:0:0","20:0:0","22:0:0","0:0:0"]
    time_range_map = {}
    for i,t in enumerate(times):
        epoch = int(time.mktime(time.strptime(t, pattern)))
        time_range_map[i] = epoch
    return time_range_map
'''
    
        
def get_time( key):
    times = ["0:0:0","2:0:0","4:0:0","6:0:0","8:0:0","10:0:0","12:0:0","14:0:0","16:0:0","18:0:0","20:0:0","22:0:0","0:0:0"]
    low_range = times[key]
    high_range = times[key+1]
    return low_range, high_range
