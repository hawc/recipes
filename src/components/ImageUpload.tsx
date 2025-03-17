"use client";

import { useRecipeContext } from "@/context/RecipeContext";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import type { Image } from "types/receipe";

export function ImageUpload() {
  const {
    recipe, 
  } = useRecipeContext();
  const images = recipe?.images ?? [];
  const [currentImages, setCurrentImages] = useState<Image[]>(images);

  function updateImages(images) {
    setCurrentImages(images);
    // todo: save images in DB
  }

  function addImages(event) {
    const imageFiles = event.target.files;
    const filesLength = imageFiles.length;

    for (let i = 0; i < filesLength; i++) {
      const reader = new FileReader();
      const file = imageFiles[i];

      reader.onloadend = () => {
        if (reader.result) {
          const tempImage = new Image();
          tempImage.src = reader.result as string;

          tempImage.onload = function() {
            const dbImage = {
              name: file.name,
              type: file.type,
              size: file.size,
              width: tempImage.width,
              height: tempImage.height,
              src: reader.result,
            };
            if (!images.map((image) => image.name).includes(dbImage.name)) {
              // setCurrentImages([...images, image]);
              updateImages([dbImage]);
            }
          };
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage(imageName) {
    if (imageName) {
      updateImages([...images.filter((image) => image.name !== imageName)]);
    }
  }

  return (
    <div className="file has-name is-boxed">
      <label className="file-label flex-basis-full">
        <input
          className="file-input"
          type="file"
          name="images"
          onInput={addImages}
          multiple
        />
        <span className="file-cta">
          <span className="file-label">Foto auswählen…</span>
        </span>
        <div className="is-flex is-flex-direction-column">
          {currentImages.map((image: Image) => (
            <div key={image.name} className="file-name is-flex">
              <div className="is-flex-grow-1 is-overflow-ellipsis">
                {image.name}
              </div>
              <button
                type="button"
                onClick={() => {
                  removeImage(image.name);
                }}
                className="button is-white py-0 px-3 is-height-4 is-va-baseline"
              >
                <span className="icon is-medium">
                  <XMarkIcon />
                </span>
              </button>
            </div>
          ))}
        </div>
      </label>
    </div>
  );
}
