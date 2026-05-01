import bcrypt from 'bcrypt';

const hash = '$2b$10$vj5aCm2Xqh8IlxF.VBkG0OBfOjydUu44VW0X7ki5HGKkvsRFq1ytO';
const password = 'admin';

bcrypt.compare(password, hash).then(result => {
    console.log('Password "admin" match:', result);
});
