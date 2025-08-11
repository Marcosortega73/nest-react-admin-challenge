import useAuth from '@hooks/useAuth';
import { ButtonComponent } from '@shared/components/buttons';
import { useMemo } from 'react';
import { BookOpen, Eye, EyeOff, Users } from 'react-feather';

import { useCourseCounts } from '../hooks/useCourseCounts';

export type CourseFilterType = 'all' | 'my-courses' | 'published' | 'draft';

interface CourseFilterButtonsProps {
  activeFilter: CourseFilterType;
  onFilterChange: (filter: CourseFilterType) => void;
}

export default function CourseFilterButtons({ activeFilter, onFilterChange }: CourseFilterButtonsProps) {
  const { authenticatedUser } = useAuth();
  const userRole = authenticatedUser?.role;

  // Obtener contadores globales desde la API
  const { data: counts, isLoading } = useCourseCounts();

  // Si está cargando, mostrar 0 en los badges
  const filterCounts = {
    all: counts?.all || 0,
    'my-courses': counts?.myCourses || 0,
    published: counts?.published || 0,
    draft: counts?.draft || 0,
  };

  // Configuración de botones según el rol
  const filterButtons = useMemo(() => {
    const buttons = [
      {
        key: 'all' as CourseFilterType,
        title: 'Todos los cursos',
        icon: <BookOpen className="w-4 h-4" />,
        count: filterCounts.all,
      },
      {
        key: 'my-courses' as CourseFilterType,
        title: 'Mis cursos',
        icon: <Users className="w-4 h-4" />,
        count: filterCounts['my-courses'],
      },
    ];

    // Solo agregar filtros de estado para admin/editor
    if (userRole !== 'user') {
      buttons.push(
        {
          key: 'published' as CourseFilterType,
          title: 'Publicados',
          icon: <Eye className="w-4 h-4" />,
          count: filterCounts.published,
        },
        {
          key: 'draft' as CourseFilterType,
          title: 'Borradores',
          icon: <EyeOff className="w-4 h-4" />,
          count: filterCounts.draft,
        },
      );
    }

    return buttons;
  }, [userRole, filterCounts]);

  return (
    <div className="flex items-center w-full ">
      <div className="flex flex-wrap gap-3">
        {filterButtons.map(button => (
          <div key={button.key} className="flex items-center">
            <ButtonComponent
              onClick={() => onFilterChange(button.key)}
              variant={activeFilter === button.key ? 'primary' : 'secondary'}
              size="sm"
              title={button.title}
              icon={button.icon}
              className={`transition-all duration-200 ${
                activeFilter === button.key
                  ? 'shadow-md transform scale-105'
                  : 'hover:shadow-sm hover:transform hover:scale-102'
              }`}
              badge={button?.count || 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
