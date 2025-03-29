import { Image } from "types/recipe";

interface ImageThumbnailProps {
  image?: Image
}

export function ImageThumbnail({
  image, 
}: ImageThumbnailProps) {
  return (
    <>
      <div
        style={{
          backgroundImage: image
            ? `url(/uploads/${image.name})`
            : "url(/uploads/blank.png)",
        }}
        className="thumbnail p-0 max-width-100"
      ></div>
    </>
  );
}
