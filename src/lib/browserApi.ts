export function share(content: string) {
  navigator
    .share({
      text: content,
    })
    .catch((error: Error) => {
      if (error.name === "AbortError") {
        console.log("Sharing aborted.");

        return;
      }

      console.warn(error);
    });
}
