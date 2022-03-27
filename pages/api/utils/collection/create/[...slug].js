import { client } from "../../../../../lib/sanityClient";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
  const { slug } = req.query;
  const uid = slug[0];
  const title = slug[1];

    const doc = {
        _type: 'pinCollection',
        title,
        userId: uid,
        isPrivate:false,
        postedBy: {
            _type: 'postedBy',
            _ref: uid,
        }
    };
 
    const response = await client.create(doc);

    res.status(200).json({ collectionData: response });
}