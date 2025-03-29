import { ImageInput } from "@/schema/types.generated";
import { writeFileSync } from "fs";
import path from "path";

export const imageDirectory = path.join(process.cwd(), "uploads");

export function writeFileToDisc(image: ImageInput): void {
  if (!image.src) {
    console.warn("No file src found.");

    return;
  }

  const ext = image.src.substring(
    image.src.indexOf("/") + 1,
    image.src.indexOf(";base64"),
  );
  const fileType = image.src.substring("data:".length, image.src.indexOf("/"));
  const regex = new RegExp(`^data:${fileType}/${ext};base64,`, "gi");
  const base64Data = image.src.replace(regex, "");

  writeFileSync(`${imageDirectory}/${image.name}`, base64Data, "base64");
}