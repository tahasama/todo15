import crypto from 'crypto';


export const saltAndHashPassword = (password:string) => {
    const salt = crypto.randomBytes(16).toString('hex'); // Generate a random 16-byte salt
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex'); // Hash the password using the salt
  return `${salt}:${hash}`; // Store salt and hash together for later verification

}