"use client";

import { ImageUpload } from "./ImageUpload";
import { Mobile } from "./responsive";

export function MobileImageUpload() {
  return (
    <Mobile>
      <div className="block px-0 pb-2">
        <div className="field">
          <ImageUpload />
        </div>
      </div>
    </Mobile>
  );
}