import { client } from "../../../../lib/sanityClient";
import { userCreatedPinsQuery } from "../../../../lib/Data";

export default async function handler(req, res) {
    
    const { uId } = req.query;
    
    const createdPinsQuery = userCreatedPinsQuery(uId);

    const data = await client.fetch(createdPinsQuery);

    res.status(200).json({ pins: data[0]?.pins });
}