import Layout from '@components/layout';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

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
  const step = Math.max(1, Math.min(4, Number(sp.get('step') ?? 1)));
  const mode: 'create' | 'edit' = id ? 'edit' : 'create';

  const methods = useForm<CourseForm>({
    defaultValues: { name: '', description: '', imageUrl: '', resources: [], modules: [], lessons: [] },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (mode === 'edit' && id) {
      courseService.findOne(id).then(data => {
        // TODO: adaptar si el shape del backend difiere del form
        methods.reset({
          name: data.name ?? '',
          description: data.description ?? '',
          /*  imageUrl: data.imageUrl ?? '',
          resources: data.resources ?? [],
          modules: data.modules ?? [],
          lessons: data.lessons ?? [], */
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  const next = () => setSp({ step: String(step + 1) });
  const back = () => setSp({ step: String(step - 1) });

  const finish = methods.handleSubmit(async payload => {
    if (mode === 'create') await courseService.save(payload);
    else if (id) await courseService.update(id, payload);
    navigate('/courses', { replace: true });
  });

  return (
    <Layout>
      <div className="mb-6">
        <Stepper current={step} steps={['Info', 'Modules', 'Lessons', 'Review']} />
      </div>

      <FormProvider {...methods}>
        {step === 1 && <StepInfo onNext={next} />}
        {step === 2 && <StepModules onNext={next} onBack={back} />}
        {step === 3 && <StepLessons onNext={next} onBack={back} />}
        {step === 4 && <StepReview onBack={back} onFinish={finish} />}
      </FormProvider>
    </Layout>
  );
}
