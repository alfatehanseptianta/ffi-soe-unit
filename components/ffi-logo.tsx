type FFILogoProps = {
  className?: string;
  alt?: string;
  src?: string;
};

export function FFILogo({
  className,
  alt = 'Future Farmers Indonesia logo',
  src = '/ffi-logo.png',
}: FFILogoProps) {
  const classes = className ? `block ${className}` : 'block';

  return <img src={src} alt={alt} className={classes} loading="eager" decoding="async" />;
}
