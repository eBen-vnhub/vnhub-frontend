import { FileText } from 'lucide-react';

interface VendorDocumentsSectionProps {
  vl: any;
  listing: any;
  t: any;
}

export default function VendorDocumentsSection({ vl, listing, t }: VendorDocumentsSectionProps) {
  if (!vl.files?.length) return null;

  return (
    <div className="border-t border-border pt-5 space-y-2">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        {listing.documents}
      </span>
      <div className="flex flex-wrap gap-2">
        {vl.files.map((f: any, idx: number) => (
          <a
            key={idx}
            href={f.fileUrl || f.url || '#'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-surface-hover px-3 py-1.5 rounded-lg border border-border text-xs text-main hover:border-brand/30 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-medium truncate max-w-[120px]" title={f.fileName}>{f.fileName}</span>
            <span className="text-[9px] bg-brand/10 text-brand px-1.5 py-0.5 rounded">
              {(t.common.documentTypes as any)?.[f.fileType] || f.fileType?.replace(/_/g, ' ')}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
