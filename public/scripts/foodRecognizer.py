import requests
# If you are using a Jupyter notebook, uncomment the following line.
# %matplotlib inline
import sys
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import json
from PIL import Image
from io import BytesIO

# Replace <Subscription Key> with your valid subscription key.
subscription_key = "12314c0db72b4c519c00ebf7f130dcd0"
assert subscription_key

# You must use the same region in your REST call as you used to get your
# subscription keys. For example, if you got your subscription keys from
# westus, replace "westcentralus" in the URI below with "westus".
#
# Free trial subscription keys are generated in the westcentralus region.
# If you use a free trial subscription key, you shouldn't need to change
# this region.
vision_base_url = "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/"

analyze_url = vision_base_url + "analyze"

# # for online images
# image_url = "https://www.rareseeds.com/assets/1/14/DimRegular/Corn-True-Gold-CN133-LSS-000_2485.jpg"
# data    = {'url': image_url}

# for local images
print(sys.argv[1])
image_path = "./" + sys.argv[1]
image_data = open(image_path, "rb").read()
image = mpimg.imread(image_path)


params  = {'visualFeatures': 'Categories,Description,Color'}

# # for online images
# headers = {'Ocp-Apim-Subscription-Key': subscription_key }
# response = requests.post(analyze_url, headers=headers, params=params, json=data)

# for local images
headers    = {'Ocp-Apim-Subscription-Key': subscription_key,
              'Content-Type': 'application/octet-stream'}
response = requests.post(
    analyze_url, headers=headers, params=params, data=image_data)

response.raise_for_status()

# The 'analysis' object contains various fields that describe the image. The most
# relevant caption for the image is obtained from the 'description' property.
analysis = response.json()
tags = analysis["description"]["tags"]

with open('foodTable.json', 'r') as table:
    foodDict = json.load(table)

for tag in tags:
    for food in foodDict:
        if tag in food or food in tag:
            expVals = {tag : foodDict.get(food)}
            for val in expVals[tag]:
                expVals[tag][val] = int(expVals[tag][val])
            break
    else:
        continue
    break

with open('exp.json', 'w') as fp:
    json.dump(expVals, fp)