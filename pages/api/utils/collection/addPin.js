import { client } from "../../../../lib/sanityClient";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
    const { collectionItem,pinId,uId } = req.body;
    
    const data = await client
    .patch(collectionItem._id)
    .setIfMissing({ pins: [] })
    .insert('after', 'pins[-1]', [{
        _key: pinId+'pin',
        userId: uId,
        item: {
            _type: 'reference',
            _ref: pinId
        }
    }])
    .commit();
    

    res.status(200).json({ success:data.pins });
}