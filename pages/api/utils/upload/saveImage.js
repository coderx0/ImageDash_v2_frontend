import { client } from "../../../../lib/sanityClient";
import { nanoid } from "nanoid";
  
export default async function handler(req, res) {
    const { title, about, destination, imageAsset, userId,category } = req.body;
  const id = nanoid();
  const [categoryId, categoryTitle] = category.split(',');

    const doc = {
      _type: 'pin',
      _id:id,
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
        totalLikes:0,
        userId: userId,
        postedBy: {
          _type: 'postedBy',
          _ref: userId,
        },
        category:categoryTitle,
  };

  const categoryPatch = client.patch(categoryId)
  .setIfMissing({ pins: [] })
    .insert('after', 'pins[-1]', [{
      _key: nanoid(),
      userId,
      item: {
          _type: 'reference',
          _ref: id
      }
    }]);
    const userPatch = client.patch(userId)
    .setIfMissing({ uploads: [] })
      .insert('after', 'uploads[-1]', [{
        _key: nanoid(),
        title,
        item: {
            _type: 'reference',
            _ref: id
        }
    }]);
  
  const response = await client
    .transaction()
    .create(doc)
    .patch(categoryPatch)
    .patch(userPatch)
    .commit();
  
    res.status(200).json({ message: "Success" });
}