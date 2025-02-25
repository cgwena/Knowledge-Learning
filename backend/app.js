import createError from "http-errors";
import express from "express";
import path from "path";
import url from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import csrf from "csurf";

import swaggerjsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "KnowledgeLearning API",
      description: "Knowledge Learning API",
      contact: {
        name: "KnowledgeLearning",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

// Détermine le répertoire courant avec import.meta.url
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import indexRouter from "./routes/index.js";

// Corrigez l'importation ici
import clientDbInitConnection from "./db/mongo.js"; // Import de la fonction directement

// Initialisation de la connexion à la DB
clientDbInitConnection();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-XSRF-TOKEN"],
    exposedHeaders: ["Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken(), { httpOnly: false, secure: false, sameSite: "Lax" });
  next();
});


app.use("/", indexRouter);

const swaggerDocs = swaggerjsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Route pour valider le token CSRF
app.post("/validate-csrf-token", (req, res) => {
  const isValid = req.csrfToken() === req.headers["x-csrf-token"];
  res.json({ valid: isValid });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // Gérer les erreurs CSRF
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Token CSRF invalide ou manquant' });
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message });
});

export default app;
