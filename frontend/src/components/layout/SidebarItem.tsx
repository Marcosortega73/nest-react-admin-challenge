import { ReactNode } from 'react';
import { ChevronRight } from 'react-feather';
import { Link } from 'react-router-dom';

interface SidebarItemProps {
  children: ReactNode;
  to: string;
  active?: boolean;
}

export default function SidebarItem({ children, to, active = false }: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={`no-underline rounded-md p-3 font-semibold flex items-center justify-between gap-5
        transition-all ease-out duration-300
        ${
          active
            ? 'bg-[var(--brand-secondary)] text-[var(--brand-text-secondary)]'
            : 'bg-[var(--brand-primary)] text-[var(--brand-secondary)]'
        }
        hover:bg-[var(--brand-secondary)]
        hover:text-[var(--brand-text-secondary)]
        hover:-translate-y-0.5
        hover:shadow-lg
        active:bg-[var(--brand-primary-active)]
        active:scale-95
      `}
    >
      <span className="flex gap-5">{children}</span>
      {active ? <ChevronRight /> : null}
    </Link>
  );
}
