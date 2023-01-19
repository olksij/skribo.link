import * as StackBlur from 'stackblur-canvas';

onmessage = (event) => {
  let image: ImageData = event.data;
  postMessage(StackBlur.imageDataRGB(image, 0, 0, image.width, image.height, 180));
}
