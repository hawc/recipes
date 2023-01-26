# Das Kochbuch

Ein persönliches Kochbuch mit Lieblingsrezepten. Der Fokus liegt auf einer übersichtlichen, störungsfreien Oberfläche. Eine Vorschau gibt es auf https://kochen.hawc.de/.

## Technologie

Die folgenden Technologien sind der Hauptbestandteil dieser Anwendung:

- React
- Next.js
- TypeScript
- LowDB
- Auth0

Folgende Umgebungsvariablen müssen für Auth0 gesetzt sein:

```
AUTH0_SECRET='X'
AUTH0_BASE_URL='X'
AUTH0_ISSUER_BASE_URL='X'
AUTH0_CLIENT_ID='X'
AUTH0_CLIENT_SECRET='X'

```

Die Anwendung lässt sich mit NPM starten:

```
# run dev environment on localhost:4005
npm run dev

# build live application
npm run build

# start live application
npm run start

# export as static website
npm run export
```
