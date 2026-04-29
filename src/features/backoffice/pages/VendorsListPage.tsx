import { useEffect, useState, useMemo } from 'react';
import { Building2, Search, ChevronLeft, ChevronRight, MapPin, Tag, Filter } from 'lucide-react';
import VendorsTable from '../components/vendors/VendorsTable';
import { useBackofficeVendors } from '../hooks/useBackofficeVendors';
import { useNotifications } from '../../../hooks/useNotifications';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function VendorsListPage() {
  const { vendors, isLoading, fetchVendors } = useBackofficeVendors();
  const { t } = useLanguage();
  const vendorLabels = (t.backoffice as any)?.vendors || {};

  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useNotifications(() => {
    fetchVendors();
  });

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const uniqueCountries = useMemo(() => {
    return Array.from(new Set(vendors.map(v => v.companyCountry).filter(Boolean))).sort();
  }, [vendors]);

  const uniquePlans = useMemo(() => {
    const plans = new Set<string>();
    vendors.forEach(v => {
      if (v.subscriptions) {
        v.subscriptions.forEach((s: any) => {
          if (s.plan) plans.add(s.plan);
        });
      }
    });
    return Array.from(plans).sort();
  }, [vendors]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(vendors.map(v => v.businessCategory).filter(Boolean))).sort();
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const lowerSearch = search.toLowerCase();
      const matchesSearch = !search ||
        v.companyName?.toLowerCase().includes(lowerSearch) ||
        v.businessCategory?.toLowerCase().includes(lowerSearch) ||
        v.companyCountry?.toLowerCase().includes(lowerSearch);

      const matchesCountry = !countryFilter || v.companyCountry === countryFilter;
      const matchesPlan = !planFilter || (v.subscriptions && v.subscriptions.some((s: any) => s.plan === planFilter));
      const matchesCategory = !categoryFilter || v.businessCategory === categoryFilter;

      return matchesSearch && matchesCountry && matchesPlan && matchesCategory;
    });
  }, [vendors, search, countryFilter, planFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

  const paginatedVendors = useMemo(() => {
    return filteredVendors.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredVendors, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, countryFilter, planFilter, categoryFilter]);

  const hasActiveFilters = countryFilter || planFilter || categoryFilter;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="bg-gradient-to-br from-brand/10 to-brand/5 border border-brand/10 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-7 h-7 text-brand" />
              <h1 className="text-3xl font-bold text-main">{vendorLabels.title || 'Vendors Directory'}</h1>
            </div>
            <p className="text-muted ms-10">{vendorLabels.subtitle || 'Manage and monitor all vendors and their listings.'}</p>
          </div>

          <div className="w-full sm:w-72 relative">
            <Search className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-4" />
            <input
              type="text"
              placeholder={vendorLabels.searchPlaceholder || 'Search vendors...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl pl-11 rtl:pl-4 rtl:pr-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 relative min-w-[170px]">
            <MapPin className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted z-10" />
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-8 py-2 border border-border rounded-xl text-sm appearance-none bg-surface focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
            >
              <option value="">{vendorLabels.allCountries || 'All Countries'}</option>
              {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 relative min-w-[150px]">
            <Filter className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted z-10" />
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-8 py-2 border border-border rounded-xl text-sm appearance-none bg-surface focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
            >
              <option value="">{vendorLabels.allPlans || 'All Plans'}</option>
              {uniquePlans.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 relative min-w-[180px]">
            <Tag className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted z-10" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-8 py-2 border border-border rounded-xl text-sm appearance-none bg-surface focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
            >
              <option value="">{vendorLabels.allCategories || 'All Categories'}</option>
              {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => { setCountryFilter(''); setPlanFilter(''); setCategoryFilter(''); }}
              className="text-xs text-brand font-bold hover:underline px-2 py-1"
            >
              {vendorLabels.clearFilters || 'Clear Filters'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-surface rounded-3xl p-6 shadow-sm border border-border">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2 text-main">
            {vendorLabels.allRegistered || 'All Registered Vendors'}
            {!isLoading && (
              <span className="bg-surface-hover text-brand text-sm px-2.5 py-0.5 rounded-full">{filteredVendors.length}</span>
            )}
          </h2>
        </div>

        <VendorsTable vendors={paginatedVendors} isLoading={isLoading} />

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <span className="text-sm font-bold text-muted">
              {t.settings?.table?.page} {currentPage} {t.settings?.table?.of} {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-border text-muted hover:text-brand hover:border-brand disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-border text-muted hover:text-brand hover:border-brand disabled:opacity-50 transition-colors"
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
