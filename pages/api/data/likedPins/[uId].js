import { client } from "../../../../lib/sanityClient";
import { userLikedPinsQuery } from "../../../../lib/Data";

export default async function handler(req, res) {
    
    const { uId } = req.query;
    
    const query = userLikedPinsQuery(uId);

    const data = await client.fetch(query);

    res.status(200).json({ pins: data });
}