export const authMiddleware = async (req, res, next) => {
  try {
    const sessionId = req.headers['session-id'] || 'default-session';
    req.user = {
      uid: sessionId,
      name: 'Explorer'
    };
    next();
  } catch (error) {
    console.error('Session Middleware Error:', error.message);
    res.status(500).json({ error: 'Session extraction failed', details: error.message });
  }
};
