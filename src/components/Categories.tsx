import styles from "./Categories.module.scss";

interface CategoriesProps {
  categories: string[];
}

export function Categories({
  categories, 
}: CategoriesProps) {
  return (
    <ul className={styles.categories}>
      {categories.map((category) => (
        <li
          className="is-flex is-alignItems-center has-text-black"
          key={category}
        >
          {category}
        </li>
      ))}
    </ul>
  );
}
