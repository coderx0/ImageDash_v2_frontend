import { client } from "../../../../lib/sanityClient";

export default async function handler(req, res) {
    
    const { uId } = req.query;
    const query = `*[_type == "pinCollection" && userId == '${uId}']{
        _id,
        title,
        pins[]{
            _key,
            item->{
                _id,
                image{
                asset->{
                    url
                }
                }
            }
            },
      }`;

    const data = await client.fetch(query);

    res.status(200).json({ collections: data });
}