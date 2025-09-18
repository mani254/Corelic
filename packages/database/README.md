# @repo/database

Database schemas and types for MongoDB using Mongoose.

## Structure

```
src/
├── types/           # TypeScript interfaces and types
│   ├── index.ts
│   ├── user.ts
│   └── product.ts
├── schemas/         # Mongoose schemas and models
│   ├── index.ts
│   ├── user.ts
│   └── product.ts
└── index.ts         # Main entry point
```

## Usage

### In your server or other apps:

```typescript
// Import types
import { IUser, IUserInput, IUserResponse } from "@repo/database/types";

// Import schemas/models
import { User, Product } from "@repo/database/schemas";

// Or import everything
import { IUser, User, IProduct, Product } from "@repo/database";
```

### Example usage in server:

```typescript
import { User, IUserInput } from "@repo/database";

// Create a new user
const userData: IUserInput = {
  name: "John Doe",
  email: "john@example.com",
  password: "hashedPassword",
  role: "user",
};

const newUser = new User(userData);
await newUser.save();
```

## Development

```bash
# Build the package
pnpm build

# Watch for changes
pnpm dev

# Clean build files
pnpm clean
```

## Adding new schemas/types

1. Create a new file in `src/types/` for your TypeScript interfaces
2. Create a corresponding file in `src/schemas/` for your Mongoose schema
3. Export from the respective `index.ts` files
4. The main `index.ts` will automatically export everything
