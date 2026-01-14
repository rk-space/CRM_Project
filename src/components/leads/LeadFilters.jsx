import Select from '../form/Select';
import Input from '../form/Input';

const LeadFilters = ({ filters, onFilterChange }) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 200px' }}>
        <Input
          label="Search"
          placeholder="Name, email, phone..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>

      <div style={{ flex: '1 1 150px' }}>
        <Select
          label="Status"
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'new', label: 'New' },
            { value: 'contacted', label: 'Contacted' },
            { value: 'qualified', label: 'Qualified' },
            { value: 'unqualified', label: 'Unqualified' },
            { value: 'converted', label: 'Converted' },
          ]}
          value={filters.status || ''}
          onChange={(e) => handleChange('status', e.target.value)}
        />
      </div>

      <div style={{ flex: '1 1 150px' }}>
        <Input
          label="From Date"
          type="date"
          value={filters.fromDate || ''}
          onChange={(e) => handleChange('fromDate', e.target.value)}
        />
      </div>

      <div style={{ flex: '1 1 150px' }}>
        <Input
          label="To Date"
          type="date"
          value={filters.toDate || ''}
          onChange={(e) => handleChange('toDate', e.target.value)}
        />
      </div>
    </div>
  );
};

export default LeadFilters;
