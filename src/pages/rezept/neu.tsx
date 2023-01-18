export default function NewReceipt({ post }) {
  function handleClick() {
    fetch(`/api/receipes`).then((response) => {
      response.json().then((result) => {
        console.log(result);
      });
    });
  }
  return <button onClick={handleClick}></button>;
}
