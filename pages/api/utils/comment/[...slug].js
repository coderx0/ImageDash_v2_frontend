import { nanoid } from "nanoid";
import { client } from "../../../../lib/sanityClient";
import { pinDetailQuery } from "../../../../lib/Data";

export default async function handler(req,res){
    const { slug } = req.query;
    const pinId = slug[0];
    const commenterId = slug[1];
    const comment = slug[2];

    const response = await client
                            .patch(pinId)
                            .setIfMissing({ comments: [] })
                            .insert('after', 'comments[-1]', [{
                                comment,
                                _key: nanoid(),
                                postedBy: {
                                    _type: 'postedBy',
                                    _ref: commenterId
                                }
                            }])
        .commit();
    
    const query = pinDetailQuery(pinId);

    const data = await client.fetch(`${query}`);

    res.status(200).json({ comments: data[0].comments });
}