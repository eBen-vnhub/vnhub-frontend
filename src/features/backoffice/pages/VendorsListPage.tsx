import { useEffect } from 'react';
import { Building2, Search } from 'lucide-react';
import VendorsTable from '../components/vendors/VendorsTable';
import { useBackofficeVendors } from '../hooks/useBackofficeVendors';

export default function VendorsListPage() {
  const { vendors, isLoading, fetchVendors } = useBackofficeVendors();

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="bg-gradient-to-br from-brand/10 to-brand/5 border border-brand/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-7 h-7 text-brand" />
            <h1 className="text-3xl font-bold text-main">Vendors Directory</h1>
          </div>
          <p className="text-muted">Manage and monitor all platform vendors and their listings.</p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vendors..."
            className="w-full bg-surface border-border rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
          />
        </div>
      </div>

      <div className="bg-surface rounded-3xl p-6 shadow-sm border border-border">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2 text-main">
            All Registered Vendors
            {!isLoading && <span className="bg-surface-hover text-brand text-sm px-2.5 py-0.5 rounded-full">{vendors.length}</span>}
          </h2>
        </div>

        <VendorsTable vendors={vendors} isLoading={isLoading} />
      </div>
    </div>
  );
}
