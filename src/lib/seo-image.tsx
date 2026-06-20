import { useState, useRef, useEffect } from 'react';

interface SeoImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  srcSet?: string;
  fallback?: string;
}

export default function SeoImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes,
  srcSet,
  fallback,
}: SeoImageProps) {
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (loading === 'lazy' && imgRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            imgRef.current?.setAttribute('src', src);
            if (srcSet) imgRef.current?.setAttribute('srcset', srcSet);
            observer.unobserve(entry.target);
          }
        },
        { rootMargin: '200px' }
      );
      observer.observe(imgRef.current);
      return () => observer.disconnect();
    }
  }, [src, srcSet, loading]);

  if (hasError && fallback) {
    return (
      <img
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <img
      ref={imgRef}
      src={loading === 'eager' ? src : undefined}
      srcSet={loading === 'eager' ? srcSet : undefined}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      decoding="async"
      onError={() => setHasError(true)}
    />
  );
}
