import Location from "../models/Location.js";
import geocodingService from "../services/geocoding.service.js";

class LocationRepository {
  async create(locationData) {
    try {
      // Fetch coordinates if address information is provided
      if (
        locationData.Adress &&
        locationData.City &&
        locationData.Province &&
        locationData.Country
      ) {
        const coordinates = await geocodingService.getCoordinates(
          locationData.Adress,
          locationData.City,
          locationData.Province,
          locationData.Country
        );

        // Add coordinates to location data
        locationData.Latitude = coordinates.latitude;
        locationData.Longitude = coordinates.longitude;
      }

      return await Location.create(locationData);
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    return await Location.findByPk(id);
  }

  async update(id, locationData) {
    try {
      // Fetch new coordinates if address information is being updated
      if (
        locationData.Adress ||
        locationData.City ||
        locationData.Province ||
        locationData.Country
      ) {
        const location = await this.findById(id);
        if (location) {
          const coordinates = await geocodingService.getCoordinates(
            locationData.Adress || location.Adress,
            locationData.City || location.City,
            locationData.Province || location.Province,
            locationData.Country || location.Country
          );

          locationData.Latitude = coordinates.latitude;
          locationData.Longitude = coordinates.longitude;
        }
      }

      const [updatedRowsCount] = await Location.update(locationData, {
        where: { ID: id },
      });
      return updatedRowsCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const deletedRowsCount = await Location.destroy({
        where: { ID: id },
      });
      return deletedRowsCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default new LocationRepository();
