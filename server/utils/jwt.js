import jwt from 'jsonwebtoken';

/**
 * Generate JWT for an authenticated user
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';
  const expiresIn = process.env.JWT_EXPIRE || '30d';

  return jwt.sign({ id: userId }, secret, {
    expiresIn,
  });
};

export default generateToken;
