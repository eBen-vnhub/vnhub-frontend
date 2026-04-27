import { useEffect, useState, useMemo } from 'react';
import { Building2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import VendorsTable from '../components/vendors/VendorsTable';
import { useBackofficeVendors } from '../hooks/useBackofficeVendors';

export default function VendorsListPage() {
  const { vendors, isLoading, fetchVendors } = useBackofficeVendors();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const filteredVendors = useMemo(() => {
    if (!search) return vendors;
    const lowerSearch = search.toLowerCase();
    return vendors.filter(v => 
      v.companyName.toLowerCase().includes(lowerSearch) ||
      (v.businessCategory && v.businessCategory.toLowerCase().includes(lowerSearch)) ||
      (v.companyCountry && v.companyCountry.toLowerCase().includes(lowerSearch))
    );
  }, [vendors, search]);

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  
  const paginatedVendors = useMemo(() => {
    return filteredVendors.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredVendors, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="bg-gradient-to-br from-brand/10 to-brand/5 border border-brand/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-7 h-7 text-brand" />
            <h1 className="text-3xl font-bold text-main">Vendors Directory</h1>
          </div>
          <p className="text-muted">Manage and monitor all vendors and their listings.</p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border-border rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
          />
        </div>
      </div>

      <div className="bg-surface rounded-3xl p-6 shadow-sm border border-border">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2 text-main">
            All Registered Vendors
            {!isLoading && <span className="bg-surface-hover text-brand text-sm px-2.5 py-0.5 rounded-full">{filteredVendors.length}</span>}
          </h2>
        </div>

        <VendorsTable vendors={paginatedVendors} isLoading={isLoading} />

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <span className="text-sm font-bold text-muted">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-border text-muted hover:text-brand hover:border-brand disabled:opacity-50 disabled:hover:border-border disabled:hover:text-muted transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-border text-muted hover:text-brand hover:border-brand disabled:opacity-50 disabled:hover:border-border disabled:hover:text-muted transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
