import crypto from 'crypto';


export const saltAndHashPassword = (password: string) => {
    const salt = crypto.randomBytes(16).toString("hex"); // Generate random salt
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex"); // Generate hash
    return `${salt}:${hash}`; // Store as salt:hash
  };
  