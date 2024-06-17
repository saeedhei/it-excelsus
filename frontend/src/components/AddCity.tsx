// import React, { useState } from 'react';
// import CityData from "../types/city.type";


// interface AddCityProps {
//   onCityAdded: (city: CityData) => void;
// }

// const AddCity: React.FC<AddCityProps> = ({ onCityAdded }) => {
//   const [cityName, setCityName] = useState<string>('');
//   const [count, setCount] = useState<number>(0);

//   const handleAddCity = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const response = await fetch('http://localhost:8000/api/cities', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ cityName, count }),
//     });

//     if (response.ok) {
//       const newCity = await response.json();
//       onCityAdded(newCity); // Pass the newly added city to the parent component
//       setCityName('');
//       setCount(0);
//     }
//   };

//   return (
//     <form onSubmit={handleAddCity}>
//       <input
//         type="text"
//         placeholder="City Name"
//         value={cityName}
//         onChange={(e) => setCityName(e.target.value)}
//       />
//       <input
//         type="number"
//         placeholder="Population Count"
//         value={count}
//         onChange={(e) => setCount(parseInt(e.target.value))}
//       />
//       <button type="submit">Add City</button>
//     </form>
//   );
// };

// export default AddCity;


// frontend/src/components/AddCity.tsx
// frontend/src/components/AddCity.tsx
import React, { useState } from 'react';
// import CityData from "../types/city.type";

type SearchResultsProps = {
  onSearch: (query?: string) => void; 
};

const AddCity: React.FC<SearchResultsProps> = ({ onSearch }) => {
  const [cityName, setCityName] = useState<string>('');
  const [count, setCount] = useState<number>(0);

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:8000/api/cities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cityName, count }),
    });
    setCityName('');
    setCount(0);
    onSearch(cityName);
  };

  return (
    <form onSubmit={handleAddCity}>
      <input
        type="text"
        placeholder="City Name"
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Population Count"
        value={count}
        onChange={(e) => setCount(parseInt(e.target.value))}
      />
      <button type="submit">Add City</button>
    </form>
  );
};

export default AddCity;

