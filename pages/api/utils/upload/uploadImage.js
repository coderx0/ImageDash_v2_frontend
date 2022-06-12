import { client } from '../../../../lib/sanityClient';
import formidable from 'formidable';
import { createReadStream } from "fs";

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {

  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async(err, fields, files) => {
    const selectedFile = files.uploadedFile;
    
    const response = await client.assets.
      upload('image', createReadStream(selectedFile.filepath), { contentType: selectedFile.mimetype, filename: selectedFile.originalFilename });
    
    if (response)
      res.status(200).json({ _id: response._id, url: response.url });
    else
      res.status(400).json({ error: "something wrong happened" });
    
  });
};