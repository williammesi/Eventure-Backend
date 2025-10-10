class GeocodingService {
  async getCoordinates(address, city, province, country) {
    try {
      // Build the full address string
      const fullAddress = `${address}, ${city}, ${province}, ${country}`;
      const encodedAddress = encodeURIComponent(fullAddress);

      // Use Nominatim API (OpenStreetMap)
      const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Eventure-Backend/1.0' // Nominatim requires a User-Agent
        }
      });

      if (!response.ok) {
        console.error('Geocoding API error:', response.status);
        return { latitude: null, longitude: null };
      }

      const data = await response.json();

      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      }

      return { latitude: null, longitude: null };
    } catch (error) {
      console.error('Geocoding error:', error);
      return { latitude: null, longitude: null };
    }
  }
}

export default new GeocodingService();
