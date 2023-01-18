import * as contentful from 'contentful-management';

export function initManagement() {
  const client = contentful.createClient({
    accessToken: process.env.contentfulManagementAccessToken,
  });
  client
    .getSpace(process.env.contentfulSpace)
    .then((space) => space.getEnvironment(`master`))
    .then((environment) =>
      environment.getEditorInterfaceForContentType(`receipt`),
    )
    .then((editorInterface) => console.log(editorInterface))
    .catch(console.error);
  // const contents = client
  //   .getSpace(process.env.contentfulSpace)
  //   .then((space) => space.getEnvironment(`master`))
  //   .then((environment) => environment.getContentTypes())
  //   .then((response) => console.log(response.items))
  //   .catch(console.error);

  return true;
}
