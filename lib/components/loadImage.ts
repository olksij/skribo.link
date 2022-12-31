export default function loadImage(src: string) {
  let image = document.createElement('img');
  image.src = src;

  return new Promise<HTMLImageElement>(resolve =>
    image.onload = () => resolve(image))
}