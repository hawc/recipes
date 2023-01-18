export function share(content) {
  navigator
    .share({
      text: content,
    })
    .catch((error) => {
      if (error.name === `AbortError`) {
        console.log(`Sharing aborted.`);
        return;
      }

      console.warn(error);
    });
}
