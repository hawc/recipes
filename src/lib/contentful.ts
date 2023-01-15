import * as contentful from 'contentful';

let clientConnection: contentful.ContentfulClientApi | null = null;

function client(): contentful.ContentfulClientApi {
  clientConnection =
    clientConnection ??
    contentful.createClient({
      space: `lu1rn6wobx9z`,
      environment: `master`,
      accessToken: `EMlrNYbv6CW8020fYIJmSR2c6ZG1Vfja9vJGYTozITw`,
    });

  return clientConnection;
}

export async function loadPosts(type: string) {
  const data = await client().getEntries({
    content_type: type,
  });

  return data.items;
}

export async function loadPost(id: string) {
  if (!id) {
    console.error(`No ID submitted`);
    return null;
  }
  const data = await client().getEntry(id);

  return data;
}
