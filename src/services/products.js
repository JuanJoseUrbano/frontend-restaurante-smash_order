import api from "./api";

export async function getProducts() {
  const res = await api.get("/products");
  return res.data;
}

export async function getProductsByCategory(categoryId) {
  const res = await api.get(`/products/category/${categoryId}`);
  return res.data;
}

export async function searchProductsByName(name) {
  const res = await api.get(`/products/search`, {
    params: { name },
  });
  return res.data;
}

export async function filterProductsByPrice(minPrice, maxPrice) {
  const res = await api.get(`/products/price-range`, {
    params: { minPrice, maxPrice },
  });
  return res.data;
}

export async function getProductsPaginated(page = 0, size = 3) {
  const res = await api.get("/products/paginated", {
    params: { page, size },
  });
  return res.data;
}

export async function getProductById(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

export async function searchProductsPaginated(name, page = 0, size = 3) {
  const res = await api.get(`/products/paginated/search`, {
    params: { name, page, size },
  });
  return res.data;
}

export async function filterByCategoryPaginated(categoryId, page = 0, size = 3) {
  const res = await api.get(`/products/paginated/category/${categoryId}`, {
    params: { page, size },
  });
  return res.data;
}

export async function filterByPricePaginated(minPrice, maxPrice, page = 0, size = 3) {
  const res = await api.get(`/products/paginated/price-range`, {
    params: { minPrice, maxPrice, page, size },
  });
  return res.data;
}

export async function createProduct(product) {
  return await api.post("/products", product);
}

export async function updateProduct(product) {
  return await api.put(`/products/${product.id}`, product);
}

export async function deleteProduct(id) {
  return await api.delete(`/products/${id}`);
}

export async function countAllProducts() {
  const res = await api.get("/products/count");
  return res.data;
}
