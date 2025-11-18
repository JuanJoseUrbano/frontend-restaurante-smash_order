import api from "./api";

export async function getProducts() {
  const res = await api.get("/products");
  return res.data;
}

export async function getProductById(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

export async function searchProducts(name) {
  const res = await api.get(`/products/search`, { params: { name } });
  return res.data;
}

export async function filterByCategory(categoryId) {
  const res = await api.get(`/products/category/${categoryId}`);
  return res.data;
}

export async function filterByPrice(minPrice, maxPrice) {
  const res = await api.get(`/products/price-range`, {
    params: { minPrice, maxPrice },
  });
  return res.data;
}

export async function createProduct(producto) {
  return await api.post("/products", producto);
}

export async function updateProduct(producto) {
  return await api.put(`/products/${producto.id}`, producto);
}

export async function deleteProduct(id) {
  return await api.delete(`/products/${id}`);
}

export async function countAllProducts() {
  const response = await api.get("/products/count");
  return response.data;
}