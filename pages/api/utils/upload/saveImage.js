import { client } from "../../../../lib/sanityClient";

export default async function handler(req, res) {
    const { title, about, destination, imageAsset, userId,category } = req.body;

    const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id,
          },
        },
        userId: userId,
        postedBy: {
          _type: 'postedBy',
          _ref: userId,
        },
        category,
      };
    const response = await client.create(doc);
    console.log(response);
    res.status(200).json({ message: "Success" });
}