import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, filterImageFromFile} from './util/util';
import { requireAuth } from './auth.router';
import * as AWS from './aws';
import axios from 'axios';
import fs from 'fs';
import { config } from './config/config';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  //CORS Should be restricted
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", config.dev.core_service_host);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  // Root Endpoint.
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  app.get( "/filteredimage", requireAuth, async ( req, res ) => {
      const image_url: string = req.query.image_url;
      
      // Validate the image_url query.
      if(!image_url) {
        res.status(400);
        res.send('Image url cannot be empty');
        res.end();
      } else {
        // Call filterImageFromURL(image_url) to filter the image.
        const originalImageUrl = AWS.getGetSignedUrl(image_url);
        const tempPath: string = await filterImageFromURL(decodeURIComponent(originalImageUrl));

        if(!tempPath) {
          res.status(422);
          res.send("Could not process image with url: "+ image_url);
          res.end();
        }

        // Get a S3 put URL for the filter image.
        const filteredUrl = image_url+"_filtered.jpg";
        const signedUrl = AWS.getPutSignedUrl(filteredUrl);
        try{
          const data = await new Promise((resolve, reject) => {

            // Read the temp file from disk.
            fs.readFile(tempPath, function(err, data){
              if(err) {
                reject(err);
              } else {
                resolve(data);
              }
            });
          });
          
          // Save the file to S3 using the signed url previously generated.
          await axios.put(signedUrl, data);
          res.status(200);
          res.send(AWS.getGetSignedUrl(filteredUrl));
        } catch(e) {
          console.log(e);
          res.status(500);
          res.send("Could not upload the image to S3: "+ image_url);
        }
  
        // On finish delete local files.
        res.on('finish', function() {
          try {
            deleteLocalFiles([tempPath]);
          } catch(e) {
            console.log("Could not remove file at: "+ tempPath);
          }
        }); 
      }
  });


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();