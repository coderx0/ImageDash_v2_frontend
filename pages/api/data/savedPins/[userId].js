import { client } from "../../../../lib/sanityClient";
import { userSavedPinsQuery } from "../../../../lib/Data";

export default async function handler(req, res) {
    
    const { userId } = req.query;
    
    const savedPinsQuery = userSavedPinsQuery(userId);

    const data = await client.fetch(savedPinsQuery);
    
    res.status(200).json({ pins: data });
}