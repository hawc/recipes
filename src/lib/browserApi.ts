export function share(content) {
  navigator
    .share({
      text: content,
    })
    .catch((error) => {
      if (error.name === `AbortError`) {
        console.log(`Share card was probably just dismissed`);
        return;
      }

      console.warn(error);
    });
}
