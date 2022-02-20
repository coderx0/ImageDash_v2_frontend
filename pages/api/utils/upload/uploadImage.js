import nextConnect from 'next-connect';
import multer from 'multer';
import { client } from '../../../../lib/sanityClient';
import multiparty from 'multiparty'
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




// const upload = multer({
//   storage: multer.diskStorage({
//     destination: './public/uploads',
//     filename: (req, file, cb) => cb(null, file.originalname),
//   }),
// });

// const handler = nextConnect({
//   onError(error, req, res) {
//     res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
//   },
//   onNoMatch(req, res) {
//     res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
//   },
// });

// handler.use(upload.single('uploadedFile'));

// handler.post(async (req, res) => {
//   const selectedFile = req.file;
//   console.log(selectedFile);
//   // const response = await client.assets
//   //   .upload('image', selectedFile, { contentType: selectedFile.mimetype, filename: selectedFile.originalname });
  
//   // console.log(response);
//   res.status(200).json({ data: 'success' });
// });



// const middleware = nextConnect()

// middleware.use( (req, res, next) => {
//   const form = new multiparty.Form()

//   form.parse(req, function (err, fields, files) {
//     req.files = files
//     next()
//   })
// })

// const handler = nextConnect()
// handler.use(middleware)

// handler.post(async (req, res) => {
//   const selectedFile = req.files.uploadedFile[0];
//   console.log(selectedFile);
//   // const response = await client.assets
//   //   .upload('image', selectedFile, { contentType: 'image/png', filename: selectedFile.originalFilename });
//   // console.log(response);
//   res.status(200).json({ message: "success" });
// })