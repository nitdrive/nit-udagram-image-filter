export const config = {
    "dev": {
      "username": process.env.POSTGRES_USERNAME,
      "password": process.env.POSTGRES_PASSWORD,
      "database": process.env.POSTGRES_DATABASE,
      "host": process.env.POSTGRES_HOST,
      "dialect": "postgres",
      "core_service_host": process.env.CORE_SERVICE_HOST,
      "front_end_host": process.env.FRONT_END_HOST,
      "image_filter_host": process.env.IMAGE_FILTER_HOST,
      "aws_region": process.env.AWS_REGION,
      "aws_profile": process.env.AWS_PROFILE,
      "aws_media_bucket": process.env.AWS_MEDIA_BUCKET,
      "jwt": {
        "secret": process.env.JWT_SECRET
      }
    },
    "prod": {
      "username": "",
      "password": "",
      "database": "udagram_prod",
      "host": "",
      "dialect": "postgres"
    }
  }