# Product Catalog - Full Stack Assessment

A production-quality Product Catalog application built with modern web technologies. This project demonstrates backend API excellence, rich frontend state management, and robust data handling.

## 🚀 Tech Stack

- **Backend**: Node.js (Express), TypeScript, Prisma ORM
- **Database**: PostgreSQL (Relational schema, GIN indexes for Full-Text Search)
- **Frontend**: React (Vite), TypeScript, Tailwind CSS v4
- **State Management**: React Context API + `useReducer`
- **Tooling**: Axios (API Layer), Lucide React (Icons), Zod (Validation), Prisma (Migrations)

---

## 🛠️ Local Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL instance running locally or via Docker
- npm or yarn

### 1. Clone & Install
```bash
git clone <repo-url>
cd product-catalog

# Setup Backend
cd backend
npm install

# Setup Frontend
cd ../frontend
npm install
```

### 2. Environment Configuration
Create `.env` files based on the `.env.example` provided in both `/backend` and `/frontend`.

**Backend (`backend/.env`)**:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/product_db?schema=public"
PORT=5001
CORS_ORIGIN=http://localhost:5173
```

### 3. Database Migration & Seeding
```bash
cd backend
# Run migrations
npx prisma migrate dev --name init

# Seed data (200+ rows)
npm run seed
```

### 4. Run the Application
```bash
# In backend directory
npm run dev

# In frontend directory
npm run dev
```

---

## 📊 Database Schema

```text
+----------------+          +----------------+
|    Category    |          |    Product     |
+----------------+          +----------------+
| id (UUID) [PK] |<---------| id (UUID) [PK] |
| name (String)  |          | name (String)  |
+----------------+          | description    |
                            | categoryId [FK]|
                            | price (Decimal)|
                            | stock (Int)    |
                            | rating (Dec)   |
                            | tags (Array)   |
                            | isActive (Bool)|
                            | createdAt      |
                            | updatedAt      |
                            +----------------+
```

### Performance Optimizations
- **GIN Index**: Applied on `name` and `description` for high-speed ILIKE and full-text searches.
- **B-tree Indexes**: Applied on `category`, `price`, and `rating` for efficient filtered sorting.
- **Pagination**: Implemented at the DB level using Prisma's `skip` and `take`.

---

## 📡 API Reference

**Base URL**: `/api/v1`

| Method | Path | Description | Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/products` | List all products | `search`, `category`, `min_price`, `max_price`, `min_rating`, `in_stock`, `tags`, `sort_by`, `sort_order`, `page`, `limit` |
| `GET` | `/products/:id` | Single product detail | - |
| `GET` | `/products/categories` | Distinct categories with counts | - |
| `GET` | `/products/stats` | Aggregated stats for filtered data | Same as `/products` |
| `POST` | `/products` | Create a new product | Body: Product JSON |
| `PATCH` | `/products/:id` | Partial update | Body: Partial Product JSON |
| `DELETE`| `/products/:id` | Soft delete (isActive=false) | - |

---

## 🎨 Design Decisions

1. **PostgreSQL over MongoDB**: Chosen for strict relational integrity and superior support for complex decimal precision (currency) and specialized indexes (GIN).
2. **Context + useReducer**: Better for "Product Listing" state where multiple filters, sorting, and pagination options need to be synced and passed deep into the tree without Redux overhead.
3. **URL State Sync**: Crucial for UX. Users can refresh or share URLs without losing their filtered view.
4. **Tailwind CSS v4**: Utilized the new CSS-first engine for faster builds and modern layout utilities.
5. **AbortController**: Every search request cancels the previous one to prevent race conditions and reduce server load during fast typing.

---

## 🧠 Known Limitations & Future Improvements
- **Image Uploads**: Currently uses placeholders. Integration with AWS S3/Cloudinary would be the next step.
- **Authentication**: JWT-based auth for administrative routes.
- **Caching**: Redis implementation for the `/stats` endpoint to handle heavy filter traffic.
- **Unit Testing**: Expansion of Vitest/Supertest suites.
