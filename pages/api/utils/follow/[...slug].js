import { client } from "../../../../lib/sanityClient";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
    const { slug } = req.query;
    
    const uploaderId = slug[0];
    const userId = slug[1];

    const uploaderResponse =  await client
                        .patch(uploaderId)
                        .setIfMissing({ followers: [] })
                        .insert('after', 'followers[-1]', [{
                            _key: nanoid(),
                            userId: userId,
                            followedBy: {
                                _type: 'postedBy',
                                _ref: userId,
                            },
                        }])
                        .commit();
  
    const userResponse = await client
                        .patch(userId)
                        .setIfMissing({ following: [] })
                        .insert('after', 'following[-1]', [{
                        _key: nanoid(),
                            userId: uploaderId,
                            following: {
                                _type: 'postedBy',
                                _ref: uploaderId,
                            },
                        }])
        .commit()
    
    res.status(200).json({message: uploaderResponse && userResponse ? 'success':'failed'});
}