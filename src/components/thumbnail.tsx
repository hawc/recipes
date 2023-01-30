import useSWR from 'swr';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export function Thumbnail({ receipe }): JSX.Element {
  const [image, setImage] = useState(``);

  const fetcher = async (url: string) => {
    const res = await fetch(url);
    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data.message);
    }
    return data;
  };

  const { data } = useSWR(() => {
    return receipe.images[0].name
      ? `/api/image?name=${receipe.images[0].name}`
      : null;
  }, fetcher);

  useEffect(() => {
    if (data) {
      setImage(data);
    }
  }, [data]);

  return (
    <>
      <div
        style={{ backgroundImage: `url(data:image/png;base64,${image})` }}
        className="thumbnail p-0 max-width-100"
      />
    </>
  );
}
