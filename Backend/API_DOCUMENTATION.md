# Product CRUD API Documentation

## Base URL
```
http://localhost:4000/api/products
```

## Endpoints

### 1. GET /api/products
**Description:** Get all products (Public endpoint)

**Authentication:** Not required

**Response:**
```json
[
  {
    "_id": "product_id",
    "name": "24 Karat Gold",
    "description": "Product description",
    "category": "Solid Pearls",
    "price": 1599,
    "image": "https://example.com/image.jpg",
    "tag": "Best Seller",
    "stock": 50,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### 2. GET /api/products/:id
**Description:** Get a single product by ID (Public endpoint)

**Authentication:** Not required

**Parameters:**
- `id` (URL parameter) - Product MongoDB ID

**Response:**
```json
{
  "_id": "product_id",
  "name": "24 Karat Gold",
  "description": "Product description",
  "category": "Solid Pearls",
  "price": 1599,
  "image": "https://example.com/image.jpg",
  "tag": "Best Seller",
  "stock": 50
}
```

**Error Response (404):**
```json
{
  "message": "Product not found"
}
```

---

### 3. POST /api/products
**Description:** Create a new product (Admin only)

**Authentication:** Required (Bearer token with ADMIN role)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "24 Karat Gold",
  "description": "The standard for gold automotive pearls",
  "category": "Solid Pearls",
  "price": 1599,
  "image": "https://example.com/image.jpg",
  "tag": "Best Seller",
  "stock": 50
}
```

**Required Fields:**
- `name` (string)
- `category` (string)
- `price` (number)

**Optional Fields:**
- `description` (string)
- `image` (string)
- `tag` (string)
- `stock` (number, default: 0)

**Response (201):**
```json
{
  "_id": "new_product_id",
  "name": "24 Karat Gold",
  "description": "The standard for gold automotive pearls",
  "category": "Solid Pearls",
  "price": 1599,
  "image": "https://example.com/image.jpg",
  "tag": "Best Seller",
  "stock": 50,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400` - Missing required fields or validation error
- `401` - Unauthorized (no token)
- `403` - Forbidden (not admin)
- `500` - Server error

---

### 4. PUT /api/products/:id
**Description:** Update an existing product (Admin only)

**Authentication:** Required (Bearer token with ADMIN role)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Parameters:**
- `id` (URL parameter) - Product MongoDB ID

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 1799,
  "stock": 75
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Response (200):**
```json
{
  "_id": "product_id",
  "name": "Updated Product Name",
  "description": "Product description",
  "category": "Solid Pearls",
  "price": 1799,
  "image": "https://example.com/image.jpg",
  "tag": "Best Seller",
  "stock": 75,
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404` - Product not found
- `401` - Unauthorized (no token)
- `403` - Forbidden (not admin)
- `500` - Server error

---

### 5. DELETE /api/products/:id
**Description:** Delete a product (Admin only)

**Authentication:** Required (Bearer token with ADMIN role)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Parameters:**
- `id` (URL parameter) - Product MongoDB ID

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

**Error Responses:**
- `404` - Product not found
- `401` - Unauthorized (no token)
- `403` - Forbidden (not admin)
- `500` - Server error

---

## Product Categories

Valid categories:
- `Solid Pearls`
- `Interference Pearls`
- `Carbon Pearls`
- `OEM+ Pearls`
- `Special Effect Pearls`
- `Chroma Pearls`

---

## Example Usage

### Create Product (cURL)
```bash
curl -X POST http://localhost:4000/api/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "24 Karat Gold",
    "category": "Solid Pearls",
    "price": 1599,
    "description": "The standard for gold automotive pearls",
    "image": "https://example.com/image.jpg",
    "tag": "Best Seller",
    "stock": 50
  }'
```

### Update Product (cURL)
```bash
curl -X PUT http://localhost:4000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1799,
    "stock": 75
  }'
```

### Delete Product (cURL)
```bash
curl -X DELETE http://localhost:4000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Admin Panel

The admin panel is available at:
- URL: `http://localhost:5173/admin/products`
- Route: `/admin/products`
- Access: Requires ADMIN role

### Features:
- ✅ View all products in a table
- ✅ Create new products
- ✅ Edit existing products (inline or full form)
- ✅ Delete products
- ✅ Real-time error/success messages
- ✅ Product image preview
- ✅ Stock management
- ✅ Tag management

