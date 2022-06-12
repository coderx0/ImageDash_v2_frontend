import { client } from "../../../../lib/sanityClient";

export default async function handler(req, res) {
    const { collectionItem,pinId,uId } = req.body;
    
    const data = await client
        .patch(collectionItem._id)
        .unset([`pins[_key=="${pinId}pin"]`])
        .commit();

    res.status(200).json({ success:'removed' });
}