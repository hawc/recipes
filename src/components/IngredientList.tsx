import {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  ReactElement,
} from 'react';
import { share } from '@/lib/browserApi';
import {
  EyeSlashIcon,
  EyeIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { useEffect } from 'react';

interface Ingredient {
  readonly amount: string;
  readonly unit: string;
  readonly name: string;
}

const IngredientList = forwardRef(
  (
    {
      list,
      upEvent,
      downEvent,
      removeEvent,
      children,
    }: {
      list: Ingredient[];
      upEvent?: any;
      downEvent?: any;
      removeEvent?: any;
      children?: ReactElement;
    },
    ref,
  ) => {
    const [strikedRows, setStrikedRows] = useState([]);
    const [exportData, setExportData] = useState(``);
    const ingredients = useRef(null);

    useImperativeHandle(ref, () => ({
      shareList(): void {
        share(exportData);
      },
    }));

    function strikeRow(ingredientID: string): void {
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
        .filter(
          (child: HTMLElement) => !strikedRows.includes(child.dataset.name),
        )
        .map((child: HTMLElement) => child.innerText.slice(0, -1));
      const formattedData = data.join(`\n`);
      setExportData(formattedData);
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
          {list.map((ingredient, index) => (
            <tr
              data-name={`${ingredient.name}-${ingredient.unit}`}
              key={`${ingredient.name}-${ingredient.unit}`}
              className={
                strikedRows.includes(`${ingredient.name}-${ingredient.unit}`)
                  ? `is-line-through`
                  : ``
              }
            >
              <td>
                {ingredient.amount}
                {` `}
                {ingredient.unit !== `Stück` && ingredient.unit}
              </td>
              <td>{ingredient.name}</td>
              <td className="is-width-0 py-1">
                <div className="is-flex is-justify-content-end">
                  {upEvent && index !== 0 && (
                    <button
                      type="button"
                      className="button button-strike is-small is-white"
                      onClick={() => upEvent(ingredient)}
                    >
                      <span className="icon is-medium">
                        <ArrowUpIcon />
                      </span>
                    </button>
                  )}
                  {downEvent && index !== list.length - 1 && (
                    <button
                      type="button"
                      className="button button-strike is-small is-white"
                      onClick={() => downEvent(ingredient)}
                    >
                      <span className="icon is-medium">
                        <ArrowDownIcon />
                      </span>
                    </button>
                  )}
                  {(removeEvent && (
                    <button
                      type="button"
                      className="button button-strike is-small is-white"
                      onClick={() => removeEvent(ingredient)}
                    >
                      <span className="icon is-medium">
                        <XMarkIcon />
                      </span>
                    </button>
                  )) || (
                    <button
                      type="button"
                      title="Zutat streichen"
                      className="button button-strike is-small is-white"
                      onClick={() =>
                        strikeRow(`${ingredient.name}-${ingredient.unit}`)
                      }
                    >
                      <span className="icon is-medium">
                        {strikedRows.includes(
                          `${ingredient.name}-${ingredient.unit}`,
                        ) ? (
                          <EyeIcon />
                        ) : (
                          <EyeSlashIcon />
                        )}
                      </span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {children}
        </tbody>
      </table>
    );
  },
);
IngredientList.displayName = `IngredientList`;

export { IngredientList };
