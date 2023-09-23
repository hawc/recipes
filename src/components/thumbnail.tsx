import { Image } from 'types/receipe';

export function Thumbnail({ image }: { image?: Image }): JSX.Element {
  return (
    <>
      <div
        style={{
          backgroundImage: image
            ? `url(/uploads/${image.name})`
            : `url(/uploads/blank.png)`,
        }}
        className="thumbnail p-0 max-width-100"
      ></div>
    </>
  );
}
