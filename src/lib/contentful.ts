import * as contentful from 'contentful';

if (process.env.NODE_ENV !== `production`) {
  require(`dotenv`).config();
}

let clientConnection: contentful.ContentfulClientApi | null = null;

function client(): contentful.ContentfulClientApi {
  clientConnection =
    clientConnection ??
    contentful.createClient({
      space: process.env.contentfulSpace,
      environment: `master`,
      accessToken: process.env.contentfulAccessToken,
    });

  return clientConnection;
}

export async function loadPosts(type: string) {
  const data = await client().getEntries({
    content_type: type,
  });

  return data.items;
}

export async function loadPost(slug: string) {
  if (!slug) {
    console.error(`No slug submitted`);
    return null;
  }
  const data = await client().getEntries({
    content_type: `receipt`,
    'fields.slug[match]': slug,
  });

  return data.items[0];
}
