import React, { useState, useEffect } from 'react';
import './App.css';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import AddCity from './components/AddCity';
import CityData from './types/city.type';

const App: React.FC = () => {
  const [results, setResults] = useState<CityData[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = async (query: string = '', page: number = 1) => {
    const response = await fetch(`http://localhost:8000/api/cities?search=${query}&page=${page}&limit=5`);
    const data = await response.json();
    setResults(data.cities);
    setTotalPages(data.totalPages);
    setCurrentPage(data.currentPage);
  };

  useEffect(() => {
    handleSearch(searchQuery, currentPage); // Load initial cities
  }, [searchQuery, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <h1>City Management</h1>
      <SearchForm onSearch={(query) => { setSearchQuery(query); setCurrentPage(1); }} />
      <AddCity onSearch={() => handleSearch(searchQuery)} />
      <SearchResults
        results={results}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearch={() => handleSearch(searchQuery, currentPage)}
      />
    </div>
  );
};

export default App;
