import { FileText } from 'lucide-react';

interface Props {
  files: any[];
}

export default function VendorDocumentsCard({ files }: Props) {
  return (
    <div>
      <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3">Documents</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {files && files.length > 0 ? (
          files.map((file: any) => (
            <div key={file.id} className="bg-surface border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted font-medium mb-0.5">{file.fileType?.replace(/_/g, ' ')}</div>
                {file.fileUrl || file.url ? (
                  <a href={file.fileUrl || file.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-brand hover:underline truncate block">
                    {file.fileName || 'View Document'}
                  </a>
                ) : (
                  <span className="text-sm font-semibold text-main truncate block">{file.fileName}</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-sm text-muted bg-surface rounded-xl p-4 border border-dashed border-border text-center">
            No documents uploaded
          </div>
        )}
      </div>
    </div>
  );
}
