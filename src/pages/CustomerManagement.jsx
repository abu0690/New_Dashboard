import { useState } from 'react';
import { Search, Filter, Download, ChevronUp, ChevronDown } from 'lucide-react';

const initialData = [
  {
    id: 1,
    organizationName: 'AT & T',
    organisationType: 'Enterprise',
    industry: 'Aviation',
    location: 'Toronto',
    serviceRegion: 'Canada',
    status: 'Active'
  },
  {
    id: 2,
    organizationName: 'Bell',
    organisationType: 'Government',
    industry: 'Government',
    location: 'Calgary',
    serviceRegion: 'Canada',
    status: 'Deactivated'
  },
  {
    id: 3,
    organizationName: 'Tesco',
    organisationType: 'Enterprise',
    industry: 'Aviation',
    location: 'Vancouver',
    serviceRegion: 'Canada',
    status: 'Active'
  },
  {
    id: 4,
    organizationName: 'TalkTalk',
    organisationType: 'Government',
    industry: 'Aviation',
    location: 'London',
    serviceRegion: 'United Kingdom',
    status: 'Active'
  },
  {
    id: 5,
    organizationName: 'Viasat',
    organisationType: 'Service provider',
    industry: 'Aviation',
    location: 'Toronto',
    serviceRegion: 'Canada',
    status: 'Active'
  }
];

export default function CustomerManagement() {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setData(sorted);
  };

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serviceRegion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'All' || item.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <ChevronUp size={14} className="text-gray-400" />;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp size={14} className="text-blue-600" /> : 
      <ChevronDown size={14} className="text-blue-600" />;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <p className="text-gray-600 mt-1">Manage user accounts, roles, and permissions</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, location, industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex gap-2">
              {['All', 'Active', 'Deactivated'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  { key: 'organizationName', label: 'Organization Name' },
                  { key: 'organisationType', label: 'Organisation type' },
                  { key: 'industry', label: 'Industry' },
                  { key: 'location', label: 'Location' },
                  { key: 'serviceRegion', label: 'Service Region' },
                  { key: 'status', label: 'Status' }
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center gap-2">
                      {label}
                      <SortIcon column={key} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {row.organizationName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {row.organisationType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {row.industry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {row.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {row.serviceRegion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      row.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

{/* Pagination */}
<div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
  <div className="flex items-center justify-center gap-3">

    {/* Previous */}
    <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
      Previous
    </button>

    {/* Page numbers */}
    {[1].map((page, idx) => (
      <button
        key={idx}
        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
          page === 1
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
      >
        {page}
      </button>
    ))}

    {/* Next */}
    <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
      Next
    </button>

  </div>
</div>

      </div>
    </div>
  );
}