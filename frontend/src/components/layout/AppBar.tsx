import Avatar from '../shared/Avatar';

function AppBar() {
  const myPhotoSrc =
    'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
  return (
    <>
      <div className="appbar-container bg-[var(--brand-header-background)] flex justify-between items-center px-5 p-3 shadow-[0_8px_16px_-12px_rgba(0,0,0,0.20)] sticky top-0 w-full z-50">
        <div className="brand-logo-container">
          <h4 className="font-semibold text-3xl">Urbano Academy</h4>
        </div>
        <div className="profile-container flex items-center gap-3">
          <Avatar src={myPhotoSrc} size="small" />
          <p className="font-semibold">John Doe</p>
        </div>
      </div>
    </>
  );
}

export default AppBar;
