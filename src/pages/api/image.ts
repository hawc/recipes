import {
  existsSync, readFileSync,
} from "fs";
import path from "path";

export default function imageHandler(req, res) {
  const {
    query, 
  } = req;
  const {
    name, 
  } = query;

  const imageDirectory = path.join(process.cwd(), "uploads");
  const imageExists = existsSync(`${imageDirectory}/${name}`);
  const image = imageExists ? readFileSync(`${imageDirectory}/${name}`) : null;

  return image
    ? res.status(200).json(image.toString("base64"))
    : res.status(404).json({ message: `Image with name: ${name} not found.` });
}
