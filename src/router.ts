import express from "express";
import fs from "fs";
import path from "path";
import log from "./logger.service";
import uploadFile from "./uploadfile.middleware";

const Router = () => {
  const router = express.Router();
  
  router.get("/", (req, res) => {
    res.sendStatus(200);
    return;
  });
  router.get("/file", (req, res) => {
    if (req.method == "GET") {
      res.setHeader("content-type", "text/html;charset=utf-8");
      res.write(
        '<form action="/upload" method="POST" enctype="multipart/form-data" style="padding: 10px;">'
      );
      res.write('<input type="file" name="file" >');
      res.write('<input type="submit">');
      res.write("</form>");
      res.end();
    } else res.sendStatus(500);
    return;
  });
  router.post("/upload", async (req, res) => {
    try {
      await uploadFile(req, res);
      if (req.file == undefined) {
      log.error( "Please upload a file!");
        return res.status(400).send({ message: "Please upload a file!" });
      }
      res.status(200).send({
        message: `Uploaded the file successfully: ${req.file.filename}`,
      });
      log.info("Uploaded the file successfully " + req.file.filename); //+ req.files.originalname,
    } catch (err) {
      log.error(err, "upload file");
      res.status(500).send({
        message: `Could not upload the file: ${req.file?.originalname}. ${err}`,
      });
    }
  });
  
  router.get("/files", (req, res) => {
    const _basedir = path.resolve(path.resolve(), "static");
    const directoryPath = path.resolve(_basedir, "uploads");
    const baseUrl = "http://localhost:3658/files/";
  
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        res.status(500).send({
          message: "Unable to scan files!",
        });
        return;
      }
  
      let fileInfos: { name: string; url: string }[] = [];
  
      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url: baseUrl + file,
        });
      });
  
      res.status(200).send(fileInfos);
    });
  });
  
  router.get("/files/:name", (req, res) => {
    const fileName = req.params.name;
    const _basedir = path.resolve(path.resolve(), "static");
    const directoryPath = path.resolve(_basedir, "uploads");
  
    res.download(directoryPath + "/" + fileName, fileName, (err) => {
      if (err) {
          log.error(err, `get /files/:name = ${fileName}`);
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
       log.info(`get OK /files/:name = ${fileName}`);
    });
  });
  
  router.delete("/files/:name", (req, res) => {
    const fileName = req.params.name;
    const _basedir = path.resolve(path.resolve(), "static");
    const directoryPath = path.resolve(_basedir, "uploads");
  
    fs.unlink(path.resolve(directoryPath , fileName), (err) => {
      if (err) {
        log.error(err, "remove file error");
        res.status(500).send({
          message: "Could not delete the file. " + err,
        });
        return
      }
      log.info(fileName ,"File is deleted.");
      res.status(200).send({
        message: "File is deleted.",
      });
    });
  });
  
  router.delete("/filess/:name", (req, res) => {
    const fileName = req.params.name;
    const _basedir = path.resolve(path.resolve(), "static");
    const directoryPath = path.resolve(_basedir, "uploads");
  
    try {
      fs.unlinkSync(path.resolve(directoryPath , fileName));
  
      log.info(fileName, "File is deleted.");
      res.status(200).send({
        message: "File is deleted.",
      });
    } catch (err) {
      log.error(err, "remove files SUN");
      res.status(500).send({
        message: "Could not delete the file. " + err,
      });
    }
  });

  return router;
};

export default Router;
