import { hashPassword } from '../../../lib/auth';
import { client } from "../../../lib/sanityClient";

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const {userId,newUserName} = req.body;

  const query = `*[_type == "user" && userName == '${newUserName}']{
    userName
  }`;

  const response = await client.fetch(query);

  if (response.length === 0) {
    
    const updateResponse = await client.patch(userId)
      .set({ userName: newUserName })
      .commit();
    res.status(200).json({ message: updateResponse.userName });

  } else {
    res.status(200).json({ error: "User name already exists" });
 }

}

export default handler;
