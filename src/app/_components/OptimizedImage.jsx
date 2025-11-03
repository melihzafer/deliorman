import Image from 'next/image';

/**
 * Optimized Image Component
 * Wrapper around next/image with sensible defaults for the restaurant website
 * 
 * @param {string} src - Image source (local path or external URL)
 * @param {string} alt - Alt text for accessibility (REQUIRED)
 * @param {boolean} priority - Load image with priority (for above-fold images)
 * @param {string} sizes - Responsive sizes attribute
 * @param {number} quality - Image quality (1-100)
 * @param {string} className - Additional CSS classes
 * @param {object} style - Additional inline styles
 * @param {number|string} width - Image width (required for static images without fill)
 * @param {number|string} height - Image height (required for static images without fill)
 * @param {boolean} fill - Use fill mode (for cover/contain images)
 * @param {string} objectFit - Object-fit property when using fill
 */
const OptimizedImage = ({
  src,
  alt = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  className = '',
  style = {},
  width,
  height,
  fill = false,
  objectFit = 'cover',
  ...props
}) => {
  // If using fill mode
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        sizes={sizes}
        className={className}
        style={{ objectFit, ...style }}
        {...props}
      />
    );
  }

  // If width and height are provided
  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        sizes={sizes}
        className={className}
        style={style}
        {...props}
      />
    );
  }

  // Fallback: require width and height
  console.error('OptimizedImage requires either fill=true or both width and height props');
  return null;
};

export default OptimizedImage;
