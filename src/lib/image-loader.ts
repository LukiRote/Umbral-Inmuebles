// `src` is an Unsplash photo id ("photo-…") or a local path ("/pano/…").
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("/")) return src;
  return `https://images.unsplash.com/${src}?w=${width}&q=${quality ?? 72}&auto=format&fit=crop`;
}
