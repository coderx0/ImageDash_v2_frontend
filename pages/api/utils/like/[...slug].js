import { client } from "../../../../lib/sanityClient";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
    const { slug } = req.query;
    
    const imageId = slug[0].slice(6);
    const userId = slug[1].slice(5);

  const response = await client
    .patch(imageId)
    .setIfMissing({ likes: [] })
    .insert('after', 'likes[-1]', [{
      _key: nanoid(),
      userId: userId,
      likedBy: {
        _type: 'postedBy',
        _ref: userId,
      },
    }])
    .setIfMissing({totalLikes:0})
    .inc({totalLikes:1})
    .commit();
    
    
    res.status(200).json({ message: response.likes });
}