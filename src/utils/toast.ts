import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) =>
    toast.success(message, {
      style: {
        background: '#e8f8f0',
        color: '#12754d',
        fontFamily: 'Rubik, sans-serif',
        borderRadius: '12px',
        border: '1px solid #1DB578',
      },
      iconTheme: { primary: '#1DB578', secondary: '#fff' },
    }),

  error: (message: string) =>
    toast.error(message, {
      style: {
        background: '#fef2f2',
        color: '#991b1b',
        fontFamily: 'Rubik, sans-serif',
        borderRadius: '12px',
        border: '1px solid #ef4444',
      },
      iconTheme: { primary: '#ef4444', secondary: '#fff' },
    }),
};
