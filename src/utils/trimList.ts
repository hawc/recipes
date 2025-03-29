export function trimList(list: string[]) {
  list.map((element) => (element = element.trim()));

  return list;
}