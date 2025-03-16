import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });

  // Set cookie with options for production deployment (Vercel)
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
    httpOnly: true, // Prevent XSS attacks (cookie can't be accessed via JS)
    sameSite: "None", // Required for cross-domain cookies (frontend on one domain, backend on another)
    secure: process.env.NODE_ENV !== "development", // true in production (Vercel serves HTTPS)
    domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined, // Allow cookies across subdomains in production
  });

  return token;
};

export default generateToken;
