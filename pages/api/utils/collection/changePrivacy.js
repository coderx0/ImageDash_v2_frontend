import { client } from "../../../../lib/sanityClient";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
    const { collection,isPrivate } = req.body;
    
    const data = await client
    .patch(collection._id)
    .setIfMissing({ pins: [] })
    .set({isPrivate:isPrivate})
    .commit();
    
    res.status(200).json({ success:'yes' });
}