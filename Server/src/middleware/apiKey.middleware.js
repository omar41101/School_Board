const { AuthenticationError, AuthorizationError } = require('../utils/errorHandler');

/**
 * API Key Types mapped to User Roles
 * - STUDENT: Can only perform GET requests (read-only)
 * - TEACHER: Can perform GET, POST, PUT, PATCH (read and write)
 * - PARENT: Can only perform GET requests (read-only)
 * - DIRECTION: Can perform GET, POST, PUT, PATCH, DELETE (full access except system admin)
 * - ADMIN: Can perform all operations including DELETE (full system access)
 */

const API_KEY_TYPES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  PARENT: 'parent',
  DIRECTION: 'direction',
  ADMIN: 'admin'
};

/**
 * Load API keys from environment variables
 */
const getApiKeys = () => {
  return {
    [API_KEY_TYPES.STUDENT]: process.env.API_KEY_STUDENT,
    [API_KEY_TYPES.TEACHER]: process.env.API_KEY_TEACHER,
    [API_KEY_TYPES.PARENT]: process.env.API_KEY_PARENT,
    [API_KEY_TYPES.DIRECTION]: process.env.API_KEY_DIRECTION,
    [API_KEY_TYPES.ADMIN]: process.env.API_KEY_ADMIN
  };
};

/**
 * Determine API key type from the provided key
 */
const getKeyType = (apiKey) => {
  const keys = getApiKeys();
  
  // Check in priority order
  if (apiKey === keys[API_KEY_TYPES.ADMIN]) {
    return API_KEY_TYPES.ADMIN;
  }
  if (apiKey === keys[API_KEY_TYPES.DIRECTION]) {
    return API_KEY_TYPES.DIRECTION;
  }
  if (apiKey === keys[API_KEY_TYPES.TEACHER]) {
    return API_KEY_TYPES.TEACHER;
  }
  if (apiKey === keys[API_KEY_TYPES.PARENT]) {
    return API_KEY_TYPES.PARENT;
  }
  if (apiKey === keys[API_KEY_TYPES.STUDENT]) {
    return API_KEY_TYPES.STUDENT;
  }
  
  return null;
};

/**
 * Check if the API key has permission for the request method
 * Permissions match the user role hierarchy
 */
const hasPermission = (keyType, method) => {
  const permissions = {
    [API_KEY_TYPES.STUDENT]: ['GET', 'HEAD', 'OPTIONS'],
    [API_KEY_TYPES.PARENT]: ['GET', 'HEAD', 'OPTIONS'],
    [API_KEY_TYPES.TEACHER]: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH'],
    [API_KEY_TYPES.DIRECTION]: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'],
    [API_KEY_TYPES.ADMIN]: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE']
  };

  return permissions[keyType]?.includes(method) || false;
};

/**
 * Map API key type to user role for authorization checks
 */
const mapKeyTypeToRole = (keyType) => {
  return keyType; // Direct mapping since they match
};

/**
 * Middleware to verify API key
 * Checks for API key in header: x-api-key
 */
const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  // If no API key provided, skip to next middleware (JWT auth will handle it)
  if (!apiKey) {
    return next();
  }

  // Verify the API key
  const keyType = getKeyType(apiKey);
  
  if (!keyType) {
    return next(new AuthenticationError('Invalid API key'));
  }

  // Check if key has permission for this HTTP method
  if (!hasPermission(keyType, req.method)) {
    return next(new AuthorizationError(
      `${keyType.toUpperCase()} API key does not have permission for ${req.method} requests`
    ));
  }

  // Attach key type to request for logging/auditing
  req.apiKeyType = keyType;
  req.isApiKeyAuth = true;

  // Create a pseudo user object for role-based authorization
  req.user = {
    role: mapKeyTypeToRole(keyType),
    isApiKey: true
  };

  // Skip JWT authentication if valid API key is provided
  req.skipJwtAuth = true;

  next();
};

/**
 * Middleware to require specific API key level
 * Usage: requireApiKey('teacher') or requireApiKey('admin')
 */
const requireApiKey = (minLevel = 'student') => {
  return (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return next(new AuthenticationError('API key is required'));
    }

    const keyType = getKeyType(apiKey);

    if (!keyType) {
      return next(new AuthenticationError('Invalid API key'));
    }

    // Check minimum level requirement based on role hierarchy
    const levels = {
      student: 1,
      parent: 1,
      teacher: 2,
      direction: 3,
      admin: 4
    };

    if (levels[keyType] < levels[minLevel]) {
      return next(new AuthorizationError(
        `This endpoint requires ${minLevel.toUpperCase()} API key or higher`
      ));
    }

    // Check method permission
    if (!hasPermission(keyType, req.method)) {
      return next(new AuthorizationError(
        `${keyType.toUpperCase()} API key does not have permission for ${req.method} requests`
      ));
    }

    req.apiKeyType = keyType;
    req.isApiKeyAuth = true;
    
    // Create pseudo user object for role-based authorization
    req.user = {
      role: mapKeyTypeToRole(keyType),
      isApiKey: true
    };
    
    req.skipJwtAuth = true;

    next();
  };
};

/**
 * Middleware to allow either JWT or API key authentication
 */
const optionalApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  // No API key, continue to JWT auth
  if (!apiKey) {
    return next();
  }

  // Validate API key
  const keyType = getKeyType(apiKey);
  
  if (!keyType) {
    return next(new AuthenticationError('Invalid API key'));
  }

  // Check permissions
  if (!hasPermission(keyType, req.method)) {
    return next(new AuthorizationError(
      `${keyType.toUpperCase()} API key does not have permission for ${req.method} requests`
    ));
  }

  req.apiKeyType = keyType;
  req.isApiKeyAuth = true;
  
  // Create pseudo user object for role-based authorization
  req.user = {
    role: mapKeyTypeToRole(keyType),
    isApiKey: true
  };
  
  req.skipJwtAuth = true;

  next();
};

module.exports = {
  verifyApiKey,
  requireApiKey,
  optionalApiKey,
  API_KEY_TYPES
};
