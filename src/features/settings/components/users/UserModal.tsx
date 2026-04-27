import { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../../i18n/LanguageContext';

interface FieldErrors {
  [key: string]: string[];
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  user?: any;
}

function parseApiErrors(err: any): FieldErrors {
  if (err?.response?.data && typeof err.response.data === 'object') {
    return err.response.data;
  }
  if (err?.data && typeof err.data === 'object') {
    return err.data;
  }
  try {
    const parsed = JSON.parse(err?.message || '{}');
    if (typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
  } catch {
    // not JSON
  }
  return {};
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <div className="flex items-start gap-1.5 mt-1.5">
      <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
      <span className="text-xs text-red-600 font-medium">{errors[0]}</span>
    </div>
  );
}

export default function UserModal({ isOpen, onClose, onSave, user }: UserModalProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'ADMIN',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'ADMIN',
      });
    } else {
      setFormData({ firstName: '', lastName: '', email: '', role: 'ADMIN' });
    }
    setFieldErrors({});
    setGeneralError('');
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});
    setGeneralError('');
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      const parsed = parseApiErrors(err);
      if (Object.keys(parsed).length > 0) {
        setFieldErrors(parsed);
      } else {
        setGeneralError(
          language === 'ar'
            ? 'حدث خطأ أثناء حفظ البيانات. تحقق من المدخلات وحاول مرة أخرى.'
            : 'An error occurred while saving. Please check your inputs and try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 bg-surface border rounded-xl text-main focus:outline-none focus:ring-1 transition-all ${
      fieldErrors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
        : 'border-border focus:border-brand focus:ring-brand'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-main">
            {user ? (t.settings?.modal?.editUser || 'Edit User') : (t.settings?.modal?.addUser || 'Add User')}
          </h2>
          <button onClick={onClose} className="p-2 text-muted hover:text-main hover:bg-surface-hover rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {generalError && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{generalError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-main mb-1.5">{t.settings?.modal?.firstName || 'First Name'}</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                className={inputClass('firstName')}
              />
              <FieldError errors={fieldErrors['firstName'] || fieldErrors['first_name']} />
            </div>
            <div>
              <label className="block text-sm font-bold text-main mb-1.5">{t.settings?.modal?.lastName || 'Last Name'}</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                className={inputClass('lastName')}
              />
              <FieldError errors={fieldErrors['lastName'] || fieldErrors['last_name']} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-main mb-1.5">{t.settings?.modal?.email || 'Email'}</label>
            <input
              type="email"
              required
              disabled={!!user}
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className={`${inputClass('email')} disabled:opacity-50 disabled:bg-surface-hover`}
            />
            <FieldError errors={fieldErrors['email']} />
          </div>

          <div>
            <label className="block text-sm font-bold text-main mb-1.5">{t.settings?.modal?.role || 'Role'}</label>
            <select
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className={inputClass('role')}
            >
              <option value="SUPER_ADMIN">{t.settings?.modal?.superAdmin || 'Super Admin'}</option>
              <option value="ADMIN">{t.settings?.modal?.admin || 'Admin'}</option>
              <option value="VSM">{t.settings?.modal?.vsm || 'VSM'}</option>
              <option value="OPERATIONS">{t.settings?.modal?.operations || 'Operations'}</option>
            </select>
            <FieldError errors={fieldErrors['role']} />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-muted hover:text-main font-bold transition-colors"
            >
              {t.settings?.modal?.cancel || 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white font-bold rounded-xl hover:bg-brand-hover active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {user ? (t.settings?.modal?.saveChanges || 'Save Changes') : (t.settings?.modal?.createUser || 'Create User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
