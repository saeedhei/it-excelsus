import http from "../axios-http";
import CityData from "../types/city.type";

class CityDataService {
  searchCities(query: string, page: number, limit: number) {
    return http.get<Array<CityData>>(`/cities?search=${query}&page=${page}&limit=${limit}`);
  }

  readCity(id: string) {
    return http.get<CityData>(`/cities/${id}`);
  }

  createCity(data: object) {
    return http.post<CityData>("/cities", data);
  }

  updateCity(data: object, id: string) {
    return http.put<CityData>(`/cities/${id}`, data);
  }

  deleteCity(id: string) {
    return http.delete<CityData>(`/cities/${id}`);
  }

  deleteAll() {
    return http.delete<CityData[]>(`/cities`);
  }
}

export default new CityDataService();
