import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Upload, X, FileText, DollarSign, Calendar, Briefcase } from 'lucide-react';
import { taskService } from '../../services/api';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';

const CreateTask = () => {
  const navigate = useNavigate();
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('budget', parseFloat(data.budget));
      formData.append('deadline', data.deadline);

      attachments.forEach((file) => {
        formData.append('attachments', file);
      });

      const response = await taskService.createTask(formData);
      toast.success('Task created successfully!');
      navigate(`/tasks/${response.data.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Post a New Task</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Describe your project and find the perfect freelancer
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('title', { 
                  required: 'Title is required',
                  maxLength: { value: 200, message: 'Title must be less than 200 characters' }
                })}
                type="text"
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="e.g. Build a React E-commerce Website"
              />
            </div>
            {errors.title && <p className="mt-2 text-sm text-error-600">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 flex pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={6}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Provide a detailed description of your project, requirements, and expectations..."
              />
            </div>
            {errors.description && <p className="mt-2 text-sm text-error-600">{errors.description.message}</p>}
          </div>

          {/* Budget + Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Budget ($) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('budget', { 
                    required: 'Budget is required', 
                    min: { value: 1, message: 'Budget must be at least $1' } 
                  })}
                  type="number"
                  min="1"
                  step="0.01"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="0.00"
                />
              </div>
              {errors.budget && <p className="mt-2 text-sm text-error-600">{errors.budget.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deadline *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('deadline', { 
                    required: 'Deadline is required',
                    validate: (value) => {
                      const selectedDate = new Date(value);
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      return selectedDate >= tomorrow || 'Deadline must be at least tomorrow';
                    }
                  })}
                  type="date"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              {errors.deadline && <p className="mt-2 text-sm text-error-600">{errors.deadline.message}</p>}
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-primary-400 dark:hover:border-primary-500 transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Click to upload files or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    PDF, DOC, TXT, Images up to 5MB each
                  </p>
                </div>
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Uploaded Files ({attachments.length})
                </h4>
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-3">
                      <Upload className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-sm text-gray-900 dark:text-white truncate block">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-all flex-shrink-0"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={() => navigate('/tasks')} size="lg">
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} size="lg">
              {isSubmitting ? 'Posting Task...' : 'Post Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;