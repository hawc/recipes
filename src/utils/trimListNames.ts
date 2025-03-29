type ArrayWithName = { name: string }[];

export function trimListNames<T extends ArrayWithName>(list: T) {
  list.map((element) => (element.name = element.name.trim()));

  return list;
}