import * as contentful from 'contentful-management';

export function initManagement() {
  const client = contentful.createClient({
    accessToken: process.env.contentfulManagementAccessToken,
  });

  const contents = client
    .getSpace(process.env.contentfulSpace)
    .then((space) => space.getEnvironment(`master`))
    .then((environment) => environment.getContentTypes())
    .then((response) => console.log(response.items))
    .catch(console.error);

  return contents;
}
