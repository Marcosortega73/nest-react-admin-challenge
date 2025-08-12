import { BarChart, Book, Settings, Users } from 'react-feather';

export type TabType = 'content' | 'members' | 'settings' | 'analytics';

export interface Tab {
  id: TabType;
  label: string;
  icon: typeof Book;
}

interface CourseTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  availableTabs: Tab[];
}

export default function CourseTabs({ activeTab, onTabChange, availableTabs }: CourseTabsProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-6 rounded-tl-md rounded-tr-md shadow-md">
      <nav className="-mb-px flex space-x-8">
        {availableTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// Helper function to get available tabs based on user role
export const getAvailableTabs = (userRole: string): Tab[] => {
  const baseTabs: Tab[] = [{ id: 'content', label: 'Content', icon: Book }];

  if (userRole === 'admin' || userRole === 'editor') {
    baseTabs.push(
      { id: 'members', label: 'Members', icon: Users },
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'analytics', label: 'Analytics', icon: BarChart },
    );
  }

  return baseTabs;
};
