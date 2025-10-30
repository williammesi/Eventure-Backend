import Category from "../models/Category.js";

class CategoryRepository {
  async retrieveAll() {
    return await Category.findAll();
  }
}

export default new CategoryRepository();
