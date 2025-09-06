import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import https from 'https';
import cluster from 'cluster';
import cors from 'cors';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { ResponseHandler } from './Configs/responseHandler.js';
import { appRoutes } from './Routes/index.js'; // Importing appRoutes from Routes/index.js
import './Configs/globals.js';

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PARSE .ENV
dotenv.config();

// CHECK WITH PROTOCOL TO USE
const SHOULD_RUN_ON_HTTP = process.env.SHOULD_RUN_ON_HTTP;
const port = process.env.PORT || 8000;
const app = express();

// Create server (no SSL logic here for now, could be added similarly)
const httpProtocol = SHOULD_RUN_ON_HTTP === 'true' ? http : https;
const server = httpProtocol.createServer(app);

// GLOBAL MIDDLEWARE
app.set('view engine', 'ejs');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'Assets')));

// RESPONSE HANDLER
app.use((req, res, next) => {
  res.handler = new ResponseHandler(req, res);
  next();
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error("Unhandled Error:", err);
  res.handler.serverError(err);
});

// ROUTES
try {
  appRoutes(app)
} catch (error) {
  console.log("Route Crash -> ", error)
}

// CLUSTERING
let numberOfCpus = os.cpus().length;

if (cluster.isPrimary) {
  if (process.env.DEVELOPMENT === 'true') numberOfCpus = 1;

  for (let i = 0; i < numberOfCpus; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online.`);
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} has exited.`);
  });

  // CRON jobs and permission checks can be imported here as ESM
} else {
  server.listen(port, () => {
    console.log('\n============== Welcome To Tcrm ================');
    console.log(`Server started on ${port} :)`);
  });
}
