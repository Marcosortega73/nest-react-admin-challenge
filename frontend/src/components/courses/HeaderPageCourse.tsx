interface HeaderPageCourseProps {
  title: string;
  className?: string;
  buttonNew?: React.ReactNode;
  isUser?: boolean;
}

export function HeaderPageCourse({ title, className = '', buttonNew, isUser }: HeaderPageCourseProps) {
  return (
    <div className={`urb_page_header flex justify-between items-center p-3 mb-5 ${className}`}>
      <h3 className="font-semibold text-3xl">{title}</h3>
      {buttonNew && !isUser ? buttonNew : null}
    </div>
  );
}
