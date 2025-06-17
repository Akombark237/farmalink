// image-loader.js
// Minimal image loader to disable image optimization

export default function imageLoader({ src, width, quality }) {
  return src;
}
