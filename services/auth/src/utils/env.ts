export const getJwtSecret = () => {
  const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SEC;

  if (!jwtSecret) {
    throw new Error("JWT secret is not configured for auth service");
  }

  return jwtSecret;
};
