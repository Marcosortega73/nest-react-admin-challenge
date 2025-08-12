import useAuth from 'context/AuthenticationContext';
import { Book, BookOpen, User, Users } from 'react-feather';
import { useQuery } from 'react-query';

import UpdateProfile from '../components/dashboard/UpdateProfile';
import Layout from '../components/layout';
import statsService from '../services/StatsService';

export default function Dashboard() {
  const { data, isLoading } = useQuery('stats', statsService.getStats);
  const { authenticatedUser } = useAuth();

  const statsCards = [
    {
      title: 'Total Users',
      value: data?.numberOfUsers || 0,
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      icon: <Users className="w-8 h-8 text-white" />,
      description: 'Registered users',
      hiddenRole: ['user'],
    },
    {
      title: 'Total Courses',
      value: data?.numberOfCourses || 0,
      bgColor: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      icon: <Book className="w-8 h-8 text-white" />,
      description: 'Available courses',
      hiddenRole: ['user'],
    },
    {
      title: 'Active Enrollments',
      value: data?.numberOfEnrollments || 0,
      bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      icon: <User className="w-8 h-8 text-white" />,
      description: 'Student enrollments',
      hiddenRole: ['user'],
    },
    {
      title: 'Published Courses',
      value: data?.numberOfPublishedCourses || 0,
      bgColor: 'bg-gradient-to-br from-primary to-primary',
      icon: <Book className="w-8 h-8 text-white" />,
      description: 'Live courses',
    },
    {
      title: 'My Courses',
      value: data?.myCoursesNumberOfEnrollments || 0,
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      icon: <BookOpen className="w-8 h-8 text-white" />,
      description: 'Enrolled courses',
      hiddenRole: ['admin', 'editor'],
    },
  ];
  return (
    <Layout>
      <div className="min-[calc(100vh-5rem)] bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-5">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600 text-lg">Welcome back! Here's what's happening with your platform.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-10 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-28"></div>
                    </div>
                    <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center w-full items-center gap-6 flex-wrap mb-5 ">
              {statsCards
                .filter(stat => !stat.hiddenRole?.includes(authenticatedUser?.role))
                .map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white w-[230px] sm:w-[250px] md:w-[260px] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100"
                  >
                    <span className="text-sm font-medium text-gray-600 uppercase tracking-wide pb-3">{stat.title}</span>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex flex-col w-full space-y-2">
                        <span className="text-4xl font-bold text-gray-900">{stat.value.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">{stat.description}</span>
                      </div>
                      <div className={`${stat.bgColor} p-4 rounded-xl shadow-lg`}>{stat.icon}</div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
                <p className="text-gray-600">Manage your account information</p>
              </div>
            </div>
            <UpdateProfile />
          </div>
        </div>
      </div>
    </Layout>
  );
}
