
import { Button, useDisclosure } from '@heroui/react';
import { FiUsers } from 'react-icons/fi';
import { PiBooksBold } from 'react-icons/pi';
import { MdTopic } from 'react-icons/md';
import { FaQuestionCircle } from 'react-icons/fa';
import { Plus, RefreshCw } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboardStats';
import BallSpinner from '../../components/Spinner/BallSpinner';
import StatCard from '../../components/Dashboard/StatCard';
import { CreateSubjectModal } from '../Content/components/modals/CreateSubjectModal';
import AnalyticsChart from '../../components/Dashboard/AnalyticsChart';


export default function DashboardPage() {
  const createModal = useDisclosure();

  const { stats, analyticsData, isLoading, refetch } = useDashboard();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <BallSpinner />
      </div>
    );
  }

  // Fallback stats to prevent undefined errors
  const displayStats = stats || {
    total_students: 0,
    total_subjects: 0,
    total_topics: 0,
    total_questions: 0
  };

  return (
    <>
      <div className="space-y-12 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Overview of platform statistics</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            <Button
              variant="flat"
              startContent={<RefreshCw className="h-4 w-4" />}
              onPress={() => refetch()}
            >
              Refresh
            </Button>

            <Button
              className="bg-kidemia-secondary text-white"
              startContent={<Plus className="h-4 w-4" />}
              onPress={createModal.onOpen}
            >
              Add Subject
            </Button>
          </div>
        </div>

        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={FiUsers} title="Students" figure={displayStats.total_students.toLocaleString()} />
            <StatCard icon={PiBooksBold} title="Subjects" figure={displayStats.total_subjects.toLocaleString()} />
            <StatCard icon={MdTopic} title="Topics" figure={displayStats.total_topics.toLocaleString()} />
            <StatCard icon={FaQuestionCircle} title="Questions" figure={displayStats.total_questions.toLocaleString()} />
          </div>

          <div className="py-6">
            <AnalyticsChart
              examsCategories={analyticsData?.examsCategories || []}
              examsSeries={analyticsData?.examsSeries || []}
              testsCategories={analyticsData?.testsCategories || []}
              testsSeries={analyticsData?.testsSeries || []}
            />
          </div>
        </div>
      </div>

      <CreateSubjectModal isOpen={createModal.isOpen} onClose={createModal.onClose} />
    </>
  );
}