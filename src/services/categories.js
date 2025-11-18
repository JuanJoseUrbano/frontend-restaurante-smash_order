import api from "./api";

export async function getCategories() {
  const res = await api.get("/categories");
  return res.data;
}

export async function getCategoriesPaginated(page = 0, size = 3) {
  const res = await api.get("/categories/paginated", {
    params: { page, size },
  });
  return res.data;
}

export async function searchCategories(name, page = 0, size = 5) {
  const response = await api.get(`/categories/search`, {
    params: { name, page, size }
  });
  return response.data;
}


export async function getCategoryById(id) {
  const res = await api.get(`/categories/${id}`);
  return res.data;
}

export async function createCategory(categoria) {
  return await api.post("/categories", categoria);
}

export async function updateCategory(categoria) {
  return await api.put(`/categories/${categoria.id}`, categoria);
}

export async function deleteCategory(id) {
  return await api.delete(`/categories/${id}`);
}

export async function countAllCategories() {
  const response = await api.get("/categories/count");
  return response.data;
}
