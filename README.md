# Das Kochbuch

Ein persönliches Kochbuch mit Lieblingsrezepten. Der Fokus liegt auf einer übersichtlichen, störungsfreien Oberfläche. Eine Vorschau gibt es auf https://kochen.hawc.de/.

## Technologie

Die folgenden Technologien sind der Hauptbestandteil dieser Anwendung:

- React
- Next.js
- TypeScript
- Contentful API

Da die Templates an die Response-Struktur von Contentful angepasst sind, lässt sich die Anwendung nicht ohne weiteres deployen, solange der Response eben nicht genau dieser Struktur entspricht. Desweiteren wird für die Contentful-API eine .env-Datei mit den folgenden Umgebungsvariablen vorausgesetzt:

```
contentfulAccessToken="TOKEN"
contentfulSpace="SPACE_ID"
```

Die Anwendung lässt sich mit NPM starten:

```
# run dev environment on localhost:3000
npm run dev

# build live application
npm run build

# start live application
npm run start

# export as static website
npm run export
```
