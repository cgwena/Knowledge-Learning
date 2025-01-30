
const bcrypt = require("bcrypt");

const passwordEntered = "password";
const passwordStored = "$2b$10$my0/Jl8eXBWxvz4ZPAyZSOsw9Fpug8jPgP3Rie1EYukKIqUTglZ1e";

bcrypt.compare(passwordEntered, passwordStored)
  .then(isMatch => console.log("Password match:", isMatch))
  .catch(err => console.error("Error:", err));