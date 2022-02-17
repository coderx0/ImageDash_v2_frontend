import { hashPassword } from '../../../lib/auth';
import { ConnectToDatabase } from '../../../lib/db';

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

  let client;

  try {
    client = await ConnectToDatabase();
  } catch (error) {
    res.status(422).json({
      errorMessage:
        'Could not connect to database',
    });
  }

  const db = client.db();

  let existingUser;

  try {
    existingUser = await db.collection('users').findOne({ '$or':[{email: email},{userName:userName}] });
  } catch (error) {
    res.status(422).json({
      errorMessage:
        'something wrong happened. Try again later!',
    });
  }
  

  if (existingUser) {
    res.status(422).json({ errorMessage: 'User exists already!' });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);

  let result;

  try {
    result = await db.collection('users').insertOne({
      email: email,
      password: hashedPassword,
      userName:userName
    });
  } catch (error) {
    res.status(422).json({ errorMessage: 'Could not sign you up.' });
    client.close();
    return;
  }

  res.status(201).json({ successMessage: 'Account created successfully. Logging you in',id:`${result.insertedId}`});
  client.close();
}

export default handler;
