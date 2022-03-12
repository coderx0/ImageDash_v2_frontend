import { hashPassword } from '../../../lib/auth';
import { client } from "../../../lib/sanityClient";

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;

  const { email, password, userName } = data;

  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 7 ||
    !userName ||
    userName.trim().length > 12
  ) {
    res.status(422).json({
      errorMessage:
        'Invalid input - password should also be at least 7 characters long.',
    });
    return;
  }

  const mailQuery = `*[_type == "user" && email == '${email}']{
    email,
  }`;
  const mailData = await client.fetch(mailQuery);
  
  if (mailData.length > 0) {
    res.status(200).json({ errorMessage: "account with provided email already exists." });
  }

  else {
    const userNameQuery = `*[_type == "user" && userName == '${userName}']{
      email,
    }`;
      const userData = await client.fetch(userNameQuery);
    if (userData.length > 0) {
      res.status(200).json({ errorMessage: "username already exists." });
    } else {
      const hashedPassword = await hashPassword(password);
      const doc = {
        _type: 'user',
        userName: userName,
        email: email,
        password: hashedPassword,
        image:'https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-man-default-avatar-png-image_2813122.jpg'
      };
      const response = await client.create(doc);
      res.status(200).json({ successMessage: "Account created successfully" });
     }
  }
}

export default handler;
