"use client";

import { ImageUpload } from "./ImageUpload";
import { Desktop } from "./responsive";

export function DesktopImageUpload() {
  return (
    <Desktop>
      <div className="column pl-5 is-relative">
        <div className="block px-0 pb-2">
          <div className="box p-0 t-5 is-sticky field">
            <ImageUpload />
          </div>
        </div>
      </div>
    </Desktop>
  );
}