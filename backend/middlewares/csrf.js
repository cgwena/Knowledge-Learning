import csrf from 'csurf';

// Configuring csrf protection
const csrfProtection = csrf({ cookie: true });

export default csrfProtection;
