import csrf from 'csurf';

// Configurer le middleware CSRF
const csrfProtection = csrf({ cookie: true });

export default csrfProtection;
