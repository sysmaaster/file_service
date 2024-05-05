import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import Router from "./router";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,HEAD,PATCH",
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // parse form data client

// Routes 
app.use( Router());

export default app;