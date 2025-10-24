import Image from "../models/Image.js";

class ImageRepository {
  async create(imageData) {
    try {
      return await Image.create(imageData);
    } catch (error) {}
  }
}

export default new ImageRepository();
