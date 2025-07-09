import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const SearchContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h2`
  color: #004080;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

const FilterButton = styled.button`
  padding: 12px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #0066cc;
    background: rgba(0, 102, 204, 0.05);
  }
`;

const SearchButton = styled.button`
  padding: 12px 24px;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #0052a3;
  }
`;

const FiltersPanel = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: ${props => props.show ? 'block' : 'none'};
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

const DateInput = styled.input`
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;

  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

const ResultsContainer = styled.div`
  display: grid;
  gap: 16px;
`;

const ResultCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #0066cc;
    box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
  }
`;

const DocIcon = styled.div`
  font-size: 40px;
  min-width: 60px;
  text-align: center;
`;

const DocInfo = styled.div`
  flex: 1;
`;

const DocTitle = styled.h4`
  color: #333;
  margin-bottom: 4px;
`;

const DocMeta = styled.div`
  color: #666;
  font-size: 14px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const DocMetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ViewButton = styled.a`
  padding: 8px 16px;
  background: #0066cc;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  transition: background 0.3s ease;

  &:hover {
    background: #0052a3;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  
  &::after {
    content: '';
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #0066cc;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function DocumentSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    startDate: '',
    endDate: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const documentTypes = [
    { value: '', label: 'All Types' },
    { value: 'bill', label: '💵 Bill' },
    { value: 'insurance', label: '🏥 Insurance' },
    { value: 'policy', label: '📋 Policy' },
    { value: 'receipt', label: '🧾 Receipt' },
    { value: 'contract', label: '📄 Contract' },
    { value: 'tax', label: '📊 Tax Document' },
    { value: 'medical', label: '⚕️ Medical Record' },
    { value: 'other', label: '📁 Other' }
  ];

  const typeIcons = {
    bill: '💵',
    insurance: '🏥',
    policy: '📋',
    receipt: '🧾',
    contract: '📄',
    tax: '📊',
    medical: '⚕️',
    other: '📁'
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (filters.type) params.append('type', filters.type);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(`/api/documents/search?${params.toString()}`);
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <SearchContainer>
      <Title>
        <span>🔍</span>
        Document Search
      </Title>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <FilterButton onClick={() => setShowFilters(!showFilters)}>
          <span>⚙️</span>
          Filters
        </FilterButton>
        <SearchButton onClick={handleSearch}>
          Search
        </SearchButton>
      </SearchBar>

      <FiltersPanel show={showFilters}>
        <FilterRow>
          <FilterGroup>
            <FilterLabel>Document Type</FilterLabel>
            <Select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Start Date</FilterLabel>
            <DateInput
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>End Date</FilterLabel>
            <DateInput
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </FilterGroup>
        </FilterRow>
      </FiltersPanel>

      {loading ? (
        <LoadingSpinner />
      ) : results.length > 0 ? (
        <ResultsContainer>
          {results.map((doc, index) => (
            <ResultCard key={doc.fileId || index}>
              <DocIcon>{typeIcons[doc.type] || '📄'}</DocIcon>
              <DocInfo>
                <DocTitle>{doc.fileName || doc.reference_id}</DocTitle>
                <DocMeta>
                  <DocMetaItem>
                    <span>📅</span>
                    {formatDate(doc.date || doc.uploadDate)}
                  </DocMetaItem>
                  {doc.amount && (
                    <DocMetaItem>
                      <span>💰</span>
                      {doc.amount}
                    </DocMetaItem>
                  )}
                  <DocMetaItem>
                    <span>🏷️</span>
                    {doc.type}
                  </DocMetaItem>
                </DocMeta>
                {doc.notes && (
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                    {doc.notes}
                  </p>
                )}
              </DocInfo>
              <ViewButton 
                href={doc.webViewLink} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View
              </ViewButton>
            </ResultCard>
          ))}
        </ResultsContainer>
      ) : (
        <EmptyState>
          <EmptyIcon>📭</EmptyIcon>
          <h3>No documents found</h3>
          <p>Try adjusting your search criteria or upload some documents first</p>
        </EmptyState>
      )}
    </SearchContainer>
  );
}

export default DocumentSearch;