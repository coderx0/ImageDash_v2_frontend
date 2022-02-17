import {client} from "../../../../lib/sanityClient";
import { feedQuery } from "../../../../lib/Data";

export default async function handler(req, res) {
    const data = await client.fetch(feedQuery);

    if (data)
        res.status(200).json({ pins: data });
    else
        res.status(422).json({ message: "failed" });
}