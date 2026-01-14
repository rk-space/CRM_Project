import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeadsTable from '../../components/leads/LeadsTable';
import LeadFilters from '../../components/leads/LeadFilters';
import PermissionWrapper from '../../app/permissions/PermissionWrapper';
import { leadsService } from '../../services/leadsService';

const LeadsList = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [selectedIds, setSelectedIds] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });

  // Fetch leads with filters and sorting
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
        page: pagination.page,
        pageSize: pagination.pageSize,
      };
      
      // API call - will be replaced with actual backend
      const response = await leadsService.getLeads(params).catch(() => getMockLeads());
      
      setLeads(response.data || response);
      setPagination(response.pagination || pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filters, sortConfig, pagination.page]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Reset to first page
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Leads</h1>
        <PermissionWrapper permission="leads.create">
          <button
            onClick={() => navigate('/leads/create')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0066cc',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            + Create Lead
          </button>
        </PermissionWrapper>
      </div>

      {/* Filters */}
      <LeadFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '4px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{selectedIds.length} lead(s) selected</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '6px 12px', cursor: 'pointer' }}>Assign</button>
            <button style={{ padding: '6px 12px', cursor: 'pointer' }}>Change Status</button>
            <button style={{ padding: '6px 12px', cursor: 'pointer', color: '#dc2626' }}>Delete</button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && <p style={{ textAlign: 'center', padding: '40px' }}>Loading leads...</p>}

      {/* Error State */}
      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '16px' }}>
          Error: {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <>
          <LeadsTable
            leads={leads}
            onSort={handleSort}
            sortConfig={sortConfig}
            onSelectionChange={setSelectedIds}
          />

          {/* Pagination */}
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                style={{ padding: '6px 12px', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page * pagination.pageSize >= pagination.total}
                style={{
                  padding: '6px 12px',
                  cursor: pagination.page * pagination.pageSize >= pagination.total ? 'not-allowed' : 'pointer',
                }}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Mock data for development (remove when backend is ready)
const getMockLeads = () => ({
  data: [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      status: 'new',
      owner: 'Sarah Smith',
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1987654321',
      status: 'contacted',
      owner: 'Mike Johnson',
      createdAt: '2024-01-14T14:20:00Z',
    },
    {
      id: 3,
      firstName: 'Robert',
      lastName: 'Brown',
      email: 'robert.brown@example.com',
      phone: '+1122334455',
      status: 'qualified',
      owner: 'Sarah Smith',
      createdAt: '2024-01-13T09:15:00Z',
    },
  ],
  pagination: { page: 1, pageSize: 10, total: 3 },
});

export default LeadsList;
