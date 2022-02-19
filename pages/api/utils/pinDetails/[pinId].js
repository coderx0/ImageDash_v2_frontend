import { cdnClient } from "../../../../lib/sanityClient";
import { pinDetailQuery,pinDetailMorePinQuery } from "../../../../lib/Data";

export default async function handler(req, res) {
    const { pinId } = req.query;
    const query = pinDetailQuery(pinId);

    const data = await cdnClient.fetch(`${query}`);
    let morePinData = null;
    if (data[0]) {
        const query1 = pinDetailMorePinQuery(data[0]);
        morePinData = await cdnClient.fetch(query1);
    }
    res.status(200).json({ pinDetail:data[0],morePins:morePinData });
}