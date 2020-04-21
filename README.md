# Udagram Image Filtering Microservice

## SCREENSHOTS
- https://s3.amazonaws.com/udagram.greetings-time.com/screenshots/eb-home.png
- https://s3.amazonaws.com/udagram.greetings-time.com/screenshots/environment-image-filter.png

## README
- Image service hosted using elastic bean stack at: : http://udagram-image-filter2.us-east-1.elasticbeanstalk.com/ can also be accessed using subdomain # http://image-filter-service.greetings-time.com/
- The front end app is hosted on S3 and can be accessed here: # http://udagram.greetings-time.com 
- App server hosted using elastic bean stack on ec2 at:  http://udagram-core-service.us-east-1.elasticbeanstalk.com/ can also be accessed using subdomain # http://api.greetings-time.com/
- App server sends the image to image service when new image is uploaded and sends the filtered image along with the main response
- Public access is restricted for important routes using JWT
- Returns proper error codes if not able to process image
