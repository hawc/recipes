import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import Image from 'next/image';

export function getRenderOptions(postdata, servings) {
  return {
    renderNode: {
      [INLINES.EMBEDDED_ENTRY]: (node, children) => {
        if (node.data.target.sys.contentType.sys.id === `ingredient`) {
          return (
            <span>
              {(node.data.target.fields.amount / postdata.fields.servings) *
                servings}
              {` `}
              {node.data.target.fields.measurement}
              {` `}
              {node.data.target.fields.name}
            </span>
          );
        }
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
        if (node.data.target.sys.contentType.sys.id === `codeBlock`) {
          return (
            <pre>
              <code>{node.data.target.fields.code}</code>
            </pre>
          );
        }

        if (node.data.target.sys.contentType.sys.id === `videoEmbed`) {
          return (
            <iframe
              src={node.data.target.fields.embedUrl}
              height="100%"
              width="100%"
              frameBorder="0"
              scrolling="no"
              title={node.data.target.fields.title}
              allowFullScreen={true}
            />
          );
        }
      },

      [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
        return (
          <Image
            src={`https://${node.data.target.fields.file.url}`}
            height={node.data.target.fields.file.details.image.height}
            width={node.data.target.fields.file.details.image.width}
            alt={node.data.target.fields.description}
          />
        );
      },
    },
  };
}
