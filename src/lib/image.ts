// Client-side image downscaling so uploaded photos are reasonably sized
// before they're uploaded to Supabase Storage.

function loadAndScale(file: File, maxSize: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("failed to load image"));
    };
    img.src = url;
  });
}

export function compressImage(file: File, maxSize = 1280, quality = 0.82): Promise<string> {
  return loadAndScale(file, maxSize).then((canvas) => canvas.toDataURL("image/jpeg", quality));
}

/** Downscales an image and returns it as a JPEG Blob, ready to upload to Supabase Storage. */
export function compressImageToBlob(file: File, maxSize = 1280, quality = 0.82): Promise<Blob> {
  return loadAndScale(file, maxSize).then(
    (canvas) =>
      new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("failed to encode image"))), "image/jpeg", quality);
      })
  );
}
