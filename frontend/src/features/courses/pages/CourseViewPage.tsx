import Layout from '@components/layout';
import useAuth from '@hooks/useAuth';
import { ToastContainer } from '@shared/components/toast';
import { useToast } from '@shared/hooks/useToast';
import { useState } from 'react';
import { Loader } from 'react-feather';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import CourseContent from '../components/CourseContent';
import { CourseHeader } from '../components/CourseHeader';
import CourseTabs, { getAvailableTabs, TabType } from '../components/CourseTabs';
import courseService from '../services/course.api';

export default function CourseViewPage() {
  const { id } = useParams<{ id: string }>();
  const { authenticatedUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const {
    data: course,
    isLoading,
    error,
  } = useQuery(['course', id], () => courseService.findOne(id!), {
    enabled: !!id,
  });

  const enrollments = course?.enrollments || [];
  const analytics = course?.analytics || null;

  const userRole = authenticatedUser?.role || 'user';
  const tabs = getAvailableTabs(userRole);

  const canSeePublished = authenticatedUser?.role === 'admin' || authenticatedUser?.role === 'editor';

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader className="animate-spin mx-auto mb-4" size={48} />
            <p className="text-gray-600">Loading course...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg font-medium">Error loading course</p>
            <p className="text-gray-600 mt-2">Please try again later</p>
          </div>
        </div>
      </Layout>
    );
  }

  const renderTabContent = () => {
    return (
      <CourseContent
        course={course}
        enrollments={enrollments}
        analytics={analytics}
        canSeePublished={canSeePublished}
        activeTab={activeTab}
        showSuccess={showSuccess}
        showError={showError}
      />
    );
  };

  return (
    <Layout>
      <div className="min-h-screen">
        <CourseHeader course={course} />
        <CourseTabs activeTab={activeTab} onTabChange={setActiveTab} availableTabs={tabs} />
        <div className="pb-8">{renderTabContent()}</div>
      </div>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </Layout>
  );
}
