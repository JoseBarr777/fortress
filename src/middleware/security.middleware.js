import aj from '#config/arcjet.js';
import { slidingWindow } from '@arcjet/node';
import logger from '#config/logger.js';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';

    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20;
        message = 'Admin request limit exceeded (20 requests per minute)';
        break;
      case 'user':
        limit = 10;
        message = 'User request limit exceeded (10 requests per minute)';
        break;
      case 'guest':
        limit = 5;
        message = 'Guest request limit exceeded (5 requests per minute)';
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );

    const decision = await client.protect(req);

    // If bot
    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot request blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });
      return res
        .status(403)
        .json({
          error: 'Forbidden',
          message: 'Automated requests are not allowed.',
        });
    }
    // If shield
    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield request blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });
      return res
        .status(403)
        .json({
          error: 'Forbidden',
          message: 'Requests blocked by security policy',
        });
    }
    // If rate limit exceeded
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Request blocked due to rate limit', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });
      return res.status(429).json({ error: 'Too Many Requests', message });
    }

    next(); // Proceed to next middleware or route handler
  } catch (e) {
    console.log('Arcject middleware error:', e);
    res
      .status(500)
      .send({
        error: 'Internal Server Error',
        message: 'Something went wrong with security middleware',
      });
  }
};

export default securityMiddleware;
