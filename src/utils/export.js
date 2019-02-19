import domToImage from 'dom-to-image';
import { saveAs } from 'file-saver';

export const downloadImage = async ({ el, filename }) => {
  const blob = await domToImage.toBlob(el);
  saveAs(blob, `${filename}.png`);
  return true;
}
