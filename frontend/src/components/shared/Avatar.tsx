const Avatar = ({ src, size = 'small' }: { src: string; size?: 'small' | 'large' }) => {
  const sizeClass = size === 'small' ? 'h-12 w-12' : 'h-24 w-24';
  return <img className={`inline-block rounded-full ring-2 ring-white ${sizeClass}`} src={src} alt="" />;
};

export default Avatar;
