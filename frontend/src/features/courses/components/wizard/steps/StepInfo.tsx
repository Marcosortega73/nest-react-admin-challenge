import { ImputTextField } from '@shared/components/imputs';
import { useEffect, useState } from 'react';
import { Image } from 'react-feather';
import { useFormContext } from 'react-hook-form';

export default function StepInfo() {
  const {
    register,
    formState: { errors },
    watch,
    clearErrors,
  } = useFormContext();

  const imageUrl = watch('imageUrl') || '';
  const [imageError, setImageError] = useState(false);
  const [debouncedImageUrl, setDebouncedImageUrl] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedImageUrl(imageUrl);
      if (imageUrl !== debouncedImageUrl) {
        setImageError(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [imageUrl, debouncedImageUrl]);

  return (
    <section className="h-full flex flex-col gap-4 px-[15rem]">
      <div className="flex flex-col mb-2 text-center">
        <h3 className="font-semibold text-xl">Course Information</h3>
        <span className="text-gray-500 text-sm">Configure the basic details of your course</span>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1">
        <div className="col-span-8 h-full space-y-3">
          <ImputTextField
            label="Course name"
            name="name"
            register={register}
            rules={{ required: 'Required' }}
            errors={errors}
            clearErrors={clearErrors}
            type="text"
            placeholder="Course name"
            className="input w-full"
            required
          />

          <ImputTextField
            label="Description"
            name="description"
            register={register}
            rules={{ required: 'Required' }}
            errors={errors}
            clearErrors={clearErrors}
            type="text"
            placeholder="Description"
            className="input w-full"
            required
            multiline
            rows={3}
          />
          <ImputTextField
            label="Cover image URL"
            name="imageUrl"
            register={register}
            errors={errors}
            clearErrors={clearErrors}
            type="text"
            placeholder="https://..."
            className="input w-full"
          />
        </div>
        <aside className="col-span-4 flex flex-col gap-5 h-full overflow-hidden justify-start">
          <div className="flex flex-col shadow-md">
            <div className="border-2 rounded p-4 text-center text-gray-500 h-full w-full border-gray-200 flex flex-col">
              <h3 className="font-semibold text-lg mb-3">Cover Preview</h3>
              <div className="flex-1 flex items-center justify-center p-4 border border-gray-200 rounded-md overflow-hidden border-dotted min-h-[200px] max-h-[300px]">
                {debouncedImageUrl && !imageError ? (
                  <img
                    src={debouncedImageUrl}
                    alt="Cover preview"
                    className="max-w-full max-h-full object-contain rounded"
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Image size={48} />
                    <span className="mt-2 text-sm">
                      {imageError ? 'Error loading image' : debouncedImageUrl ? 'Loading...' : 'No image URL provided'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
