import jwt from 'jsonwebtoken';
import User from '~/app/models/User';
import authConfig from '~/config/auth';

class SessionController {
  async store(request, response) {
    const { email, password } = request.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return response.status(400).json({ error: 'User does not exists' });

    const passwordMatch = await user.checkPassword(password);
    if (!passwordMatch)
      return response.status(400).json({ error: 'Invalid password' });

    const { id, name } = user;

    return response.json({
      user: { id, name, email },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
