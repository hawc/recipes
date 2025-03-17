import {
  NextApiRequest, NextApiResponse,
} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.query.secret !== process.env.REVALIDATION_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }
  if (!req.query.url) {
    return res.status(404).json({ message: "No URL provided" });
  }

  try {
    await res.revalidate(req.query.url as string);
    console.log(`Revalidated ${req.query.url}`);

    return res.json({ revalidated: true });
  } catch (err) {
    console.error(err);

    return res.status(500).send("Error revalidating");
  }
}
