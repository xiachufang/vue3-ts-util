import { Image } from './typedef'
export const getImageUrl = (image?: Image, width = 90, format = 'jpg') => {
  if (!image) {
    return ''
  }
  if (image.data_url) {
    return image.data_url
  }
  if (!image.url_pattern) {
    return ''
  }

  const ratio = image.original_width / image.original_height
  const height = Math.floor(Math.min(width, image.max_width) / ratio)
  return image.url_pattern.replace('{width}', width.toString()).replace('{height}', height.toString()).replace('{format}', format)
}
