import { client } from "../../../../lib/sanityClient";
import { userCollectionQuery } from "../../../../lib/Data";

export default async function handler(req, res) {
    const { uid } = req.query;

    const query = userCollectionQuery(uid);
    const data = await client.fetch(query);
    
    res.status(200).json({ collectionData: data });
}