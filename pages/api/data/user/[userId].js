import { client } from "../../../../lib/sanityClient";
import { userQuery } from "../../../../lib/Data";

export default async function handler(req, res) {
    const { userId } = req.query;
    const query = userQuery(userId);
    const data = await client.fetch(query);

    if (data)
        res.status(200).json({ sanityData: data[0] });
    else
        res.status(422).json({ message: "failed" });
}