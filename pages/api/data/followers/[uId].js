import { client } from "../../../../lib/sanityClient";

export default async function handler(req, res) {
    
    const { uId } = req.query;
    const query = `*[_type == "user" && _id == '${uId}']{
        followers[]{
            followedBy->{
                _id,
                userName,
                image
            }
        }
    }`;

    const data = await client.fetch(query);

    res.status(200).json({ followers: data[0] });
}