import { useRef, forwardRef, useImperativeHandle } from 'react';

const IngredientList = forwardRef(({ list }: { list: any }, ref) => {
  useImperativeHandle(ref, () => ({
    getAlert(): void {
      alert(`getAlert from Child`);
    },
  }));
  const ingredientsRef = useRef();
  return (
    <table className="table is-fu llwidth">
      <thead>
        <tr>
          <th>Menge</th>
          <th>Zutat</th>
        </tr>
      </thead>
      <tbody ref={ingredientsRef}>
        {list.map((ingredient) => (
          <tr key={`${ingredient.name}-${ingredient.measurement}`}>
            <td>
              {ingredient.amount}
              {` `}
              {ingredient.measurement}
            </td>
            <td>{ingredient.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});
IngredientList.displayName = `IngredientList`;

export { IngredientList };
