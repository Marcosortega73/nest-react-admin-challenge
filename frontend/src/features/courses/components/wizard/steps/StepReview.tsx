import { BarChart2, Check, Image } from 'react-feather';
import { useFormContext } from 'react-hook-form';

export default function StepReview() {
  const { watch } = useFormContext();

  const courseTitle = watch('title') || '';
  const courseDescription = watch('description') || '';
  const courseImage = watch('imageUrl') || '';
  const modules = watch('modules') || [];
  const lessons = watch('lessons') || [];

  const totalModules = modules.length;
  const totalLessons = lessons.length;
  const totalMinutes = lessons.reduce((total: number, lesson: any) => {
    return total + (lesson?.duration || 0);
  }, 0);

  return (
    <section className="h-full flex flex-col gap-4 px-[15rem]">
      <div className="flex flex-col mb-2 text-center">
        <h3 className="font-semibold text-xl">Course Review</h3>
        <span className="text-gray-500 text-sm">Verify the information before saving</span>
      </div>

      <div className="space-y-3">
        <div className="bg-white rounded-lg border p-5">
          <div className="grid grid-cols-2 gap-8 mb-4">
            <div className="flex items-center space-x-3">
              <Check className="text-green-600" size={18} />
              <h4 className="text-base font-semibold text-gray-700">Course information</h4>
            </div>
            <div className="flex items-center space-x-3">
              <Image className="object-cover rounded-lg border" />
              <h4 className="text-base font-semibold text-gray-700">Cover preview</h4>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">NOMBRE</label>
                  <p className="text-gray-700 font-medium mt-1">{courseTitle || 'Sin título'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">DESCRIPCIÓN</label>
                  <p className="text-gray-700 mt-1">{courseDescription || 'Sin descripción'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-[20rem]">
              {courseImage ? (
                <img src={courseImage} alt="Course preview" className="w-full h-36 object-cover rounded-lg border" />
              ) : (
                <div className="w-full h-36 bg-gray-100 rounded-lg border flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Sin imagen</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center space-x-3 mb-3">
            <BarChart2 size={20} className="text-primary" />
            <h4 className="text-base font-semibold text-gray-700">Course statistics</h4>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-primary mb-1">{totalModules}</div>
              <div className="text-gray-700 font-medium text-xs">Modules</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary mb-1">{totalLessons}</div>
              <div className="text-gray-700 font-medium text-xs">Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary mb-1">{totalMinutes}</div>
              <div className="text-gray-700 font-medium text-xs">Minutes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
