import * as contentful from 'contentful-management';

const client = contentful.createClient({
  accessToken: process.env.contentfulAccessToken,
});

client
  .getSpace(process.env.contentfulSpace)
  .then((space) => space.getEnvironment(`master`))
  .then((environment) => environment.getContentTypes())
  .then((response) => console.log(response.items))
  .catch(console.error);
