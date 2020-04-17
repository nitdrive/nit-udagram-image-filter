import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint.
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.get( "/filteredimage", async ( req, res ) => {
      const image_url: string = req.query.image_url;
      
      //1). Validate the image_url query.
      if(image_url) {
        
        //2). Call filterImageFromURL(image_url) to filter the image.
        const tempPath: string = await filterImageFromURL(image_url);

        // 3). Send the resulting file in the response.
        res.sendFile(tempPath);

        // 4). Delete local file after response is done.
        res.on('finish', function() {
          try{
            deleteLocalFiles([tempPath]);
          } catch(e) {
            console.log("Could not remove file at: "+ tempPath);
          }
        });
        
      } else {
        res.send('Image url cannot be empty');
      }
  });


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();