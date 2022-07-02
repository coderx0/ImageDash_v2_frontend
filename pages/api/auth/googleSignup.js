import { client } from "../../../lib/sanityClient";

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;

  const { email, userName,id } = data;


  const mailQuery = `*[_type == "user" && email == '${email}']{
    email,
  }`;
  const mailData = await client.fetch(mailQuery);
  
  if (mailData.length > 0) {
    res.status(200).json({ errorMessage: "account with provided email already exists. Sign in instead." });
    }
    else{
      const doc = {
        _type: 'user',
        _id:id,
        userName: userName,
        email: email,
        image:'https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-man-default-avatar-png-image_2813122.jpg'
      };
      const response = await client.create(doc);

      res.status(200).json({userData:response ,successMessage: "Account created successfully" });

    }  
}

export default handler;
