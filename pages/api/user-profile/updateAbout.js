import { client } from "../../../lib/sanityClient";

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const {userId,about} = req.body;


  const response = await client.patch(userId).set({about:about}).commit();

  if (response) {
    res.status(200).json({ message: "about updated" });

  } else {
    res.status(200).json({ message: "User name already exists" });
 }

}

export default handler;
