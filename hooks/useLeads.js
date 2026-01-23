import { useState, useEffect } from 'react';
import { leadsService } from '../services/leadsService';

export const useLeads = (filters = {}) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pageSize: 10 });

  const fetchLeads = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.getLeads({ ...filters, ...params });
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
  }, []);

  return { leads, loading, error, pagination, refetch: fetchLeads };
};

export const useLead = (id) => {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLead = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.getLead(id);
      setLead(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  return { lead, loading, error, refetch: fetchLead };
};
