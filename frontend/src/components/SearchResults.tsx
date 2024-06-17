import React, { useState } from 'react';
import CityData from '../types/city.type';

type SearchResultsProps = {
  results: CityData[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: () => void;
};

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  totalPages,
  currentPage,
  onPageChange,
  onSearch,
}) => {
  const [editingCity, setEditingCity] = useState<CityData | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [editedCount, setEditedCount] = useState<number>(0);

  const handleEditClick = (city: CityData) => {
    setEditingCity(city);
    setEditedName(city.cityName);
    setEditedCount(city.count);
  };

  const handleSaveClick = async () => {
    if (editingCity) {
      await fetch(`http://localhost:8000/api/cities/${editingCity._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cityName: editedName, count: editedCount }),
      });
      setEditingCity(null);
      onSearch(); // Refresh the list
    }
  };

  const handleDeleteClick = async (id: string) => {
    await fetch(`http://localhost:8000/api/cities/${id}`, {
      method: 'DELETE',
    });
    onSearch(); // Refresh the list
  };

  const handleCancelClick = () => {
    setEditingCity(null);
  };

  return (
    <div>
      <ul>
        {results.map((city) => (
          <li key={city._id}>
            {editingCity && editingCity._id === city._id ? (
              <div>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <input
                  type="number"
                  value={editedCount}
                  onChange={(e) => setEditedCount(parseInt(e.target.value))}
                />
                <button onClick={handleSaveClick}>Save</button>
                <button onClick={handleCancelClick}>Cancel</button>
              </div>
            ) : (
              <div>
                {city.cityName} - {city.count}
                <button onClick={() => handleEditClick(city)}>Edit</button>
                <button onClick={() => handleDeleteClick(city._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
