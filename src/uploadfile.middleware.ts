import path from "path";
import util from "util";
import multer from "multer";
import crypto from "crypto";

const maxSize = 25 * 1024 * 1024;

const getCrypto = (): string => {  return crypto.randomBytes(6).toString("hex");};
const _basedir = path.resolve(path.resolve(), "static");

let storage = multer.diskStorage({
  destination: (
    req: any,
    file: any,
    cb: (arg0: null, arg1: string) => void
  ) => {
    cb(null, path.resolve(_basedir, "uploads"));
  },

  filename: (req: any, file: any, cb: (arg0: null, arg1: any) => void) => {
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );
    cb(null, getCrypto() + ext);
    //cb(null, file.originalname +"_crypto_"+ getCrypto()+ ext);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).array("file", 10);

let uploadFileMiddleware = util.promisify(uploadFile);
export default uploadFileMiddleware;
