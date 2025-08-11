import CreateCourseRequest from '@models/course/CreateCourseRequest';
import { ToastContainer } from '@shared/components/toast';
import { useToast } from '@shared/hooks';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import FooterStepper from '../components/wizard/FooterStepper';
import HeaderStepper from '../components/wizard/HeaderStepper';
import { Stepper } from '../components/wizard/Stepper';
import StepInfo from '../components/wizard/steps/StepInfo';
import StepLessons from '../components/wizard/steps/StepLessons';
import StepModules from '../components/wizard/steps/StepModules';
import StepReview from '../components/wizard/steps/StepReview';
import courseService from '../services/course.api';
import { CourseForm } from '../types';

export default function CourseWizardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();
  const step = Number(sp.get('step')) || 1;
  const mode = sp.get('mode') || 'create';
  const queryClient = useQueryClient();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: CreateCourseRequest) => {
      await courseService.save(courseData);
    },
    onSuccess: () => {
      showSuccess('Curso creado exitosamente', 'El curso ha sido creado y guardado correctamente.');
      queryClient.invalidateQueries(['courses']);
      setTimeout(() => navigate('/courses'), 1500);
    },
    onError: error => {
      showError('Error al crear el curso', 'Hubo un error al crear tu curso. Por favor, inténtalo de nuevo.');
      console.error('Error creating course:', error);
    },
  });

  const methods = useForm<CourseForm>({
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      isPublished: false,
      resources: [],
      modules: [],
      lessons: [],
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (mode === 'edit' && id) {
      courseService.findOne(id).then(data => {
        methods.reset({
          name: data.name ?? '',
          description: data.description ?? '',
          imageUrl: data?.imageUrl ?? '',
          isPublished: data?.isPublished ?? false,
          resources: data?.resources ?? [],
          modules: data?.modules ?? [],
          lessons: data?.lessons ?? [],
          dateCreated: data?.dateCreated,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  const next = () => setSp({ step: String(step + 1) });
  const back = () => setSp({ step: String(step - 1) });

  const onSubmit = async () => {
    const formData = methods.getValues();

    const isValid = await methods.trigger();
    if (!isValid) {
      console.error('Form validation failed');
      return;
    }

    const createCourseRequest: CreateCourseRequest = {
      name: formData.name,
      description: formData.description,
    };

    createCourseMutation.mutate(createCourseRequest);
  };

  const onCancel = () => {
    navigate('/courses');
  };

  return (
    <FormProvider {...methods}>
      <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
        <div className="flex-shrink-0 bg-white border-b border-gray-200 z-10 shadow-sm">
          <HeaderStepper onSubmit={onSubmit} onCancel={onCancel} />
          <div className="pb-4">
            <Stepper current={step} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 1 && <StepInfo />}
          {step === 2 && <StepModules />}
          {step === 3 && <StepLessons />}
          {step === 4 && <StepReview />}
        </div>

        <div className="flex-shrink-0 bg-white border-t border-gray-200 z-10 shadow-sm">
          <FooterStepper step={step} onNext={next} onBack={back} onSubmit={onSubmit} />
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </FormProvider>
  );
}
