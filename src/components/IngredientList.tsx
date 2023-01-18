import { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { share } from '@/lib/browserApi';
import { EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

const IngredientList = forwardRef(({ list }: { list: any }, ref) => {
  const [strikedRows, setStrikedRows] = useState([]);
  const [exportData, setExportData] = useState(``);
  const ingredients = useRef(null);

  useImperativeHandle(ref, () => ({
    shareList(): void {
      share(exportData);
    },
  }));

  function strikeRow(ingredientID) {
    const rows = [...strikedRows];
    if (!strikedRows.includes(ingredientID)) {
      rows.push(ingredientID);
    } else {
      rows.splice(strikedRows.indexOf(ingredientID), 1);
    }
    setStrikedRows(rows);
  }

  useEffect(() => {
    const data = Array.from(ingredients.current.children)
      .filter((child: HTMLElement) => !strikedRows.includes(child.dataset.name))
      .map((child: HTMLElement) => child.innerText);
    setExportData(data.join(`\n`));
  }, [strikedRows, list]);

  return (
    <table className="table is-fullwidth">
      <thead>
        <tr>
          <th>Menge</th>
          <th>Zutat</th>
          <th></th>
        </tr>
      </thead>
      <tbody ref={ingredients}>
        {list.map((ingredient) => (
          <tr
            data-name={`${ingredient.name}-${ingredient.measurement}`}
            key={`${ingredient.name}-${ingredient.measurement}`}
            className={
              strikedRows.includes(
                `${ingredient.name}-${ingredient.measurement}`,
              )
                ? `is-line-through`
                : ``
            }
          >
            <td>
              {ingredient.amount}
              {` `}
              {ingredient.measurement}
            </td>
            <td>{ingredient.name}</td>
            <td className="is-width-0 py-1">
              <button
                title="Zutat streichen"
                className="button button-strike is-small is-white"
                onClick={() =>
                  strikeRow(`${ingredient.name}-${ingredient.measurement}`)
                }
              >
                <span className="icon is-medium">
                  {strikedRows.includes(
                    `${ingredient.name}-${ingredient.measurement}`,
                  ) ? (
                    <EyeIcon />
                  ) : (
                    <EyeSlashIcon />
                  )}
                </span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});
IngredientList.displayName = `IngredientList`;

export { IngredientList };
