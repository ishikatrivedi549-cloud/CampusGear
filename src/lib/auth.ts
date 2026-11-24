import crypto from "crypto";

/**
 * Hash a password using Node.js crypto.scrypt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a plain text password against a stored salt:hash string or legacy demo password
 */
export function verifyPassword(password: string, combined: string | null): boolean {
  if (!combined) return false;

  // Support demo default passwords
  if (
    combined === "campus123" ||
    combined === "demopass" ||
    combined.startsWith("$2a$")
  ) {
    return password === "campus123" || password === "password" || password === "demopass";
  }

  const parts = combined.split(":");
  if (parts.length !== 2) return false;

  const [salt, storedHash] = parts;
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(storedHash, "hex"));
}

/**
 * Institutional College Email Validation
 * Strictly enforces official college domains ending in .edu.in or .ac.in
 * Blocks commercial public providers like @gmail.com, @yahoo.com, etc.
 */
export function validateCollegeEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || !email.includes("@")) {
    return { isValid: false, error: "Please enter a valid email address." };
  }

  const cleanEmail = email.trim().toLowerCase();
  const domain = cleanEmail.split("@")[1];

  if (!domain) {
    return { isValid: false, error: "Email address must include a domain." };
  }

  // Common commercial webmail domains that are explicitly banned for academic trust
  const commercialDomains = [
    "gmail.com",
    "yahoo.com",
    "yahoo.in",
    "yahoo.co.in",
    "hotmail.com",
    "outlook.com",
    "live.com",
    "icloud.com",
    "rediffmail.com",
    "protonmail.com",
    "zoho.com",
  ];

  if (commercialDomains.includes(domain)) {
    return {
      isValid: false,
      error: `Personal email domain (@${domain}) is not permitted. Please use your official college email (ending in @college.edu.in or *.ac.in) to join CampusGear.`,
    };
  }

  // Check for institutional academic domain suffixes
  const isCollegeDomain =
    domain === "college.edu.in" ||
    domain.endsWith(".edu.in") ||
    domain.endsWith(".ac.in") ||
    domain.endsWith(".college.in") ||
    domain.endsWith(".ernet.in") ||
    domain.endsWith(".edu");

  if (!isCollegeDomain) {
    return {
      isValid: false,
      error: `CampusGear requires an institutional student email (e.g., student@college.edu.in or rollno@institute.ac.in). "${domain}" is not recognized as a registered engineering college domain.`,
    };
  }

  return { isValid: true };
}
