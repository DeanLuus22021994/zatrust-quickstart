---
applyTo: "src/**/*.tsx"
version: 2
scope: react-components
---

# React Server vs Client Component Instructions

## Core Principles

**Server-First Architecture**: Default to Server Components unless client-side interactivity is explicitly required.

**Client Boundaries**: Add `"use client"` directive only for:
- Interactive UI with event handlers (onClick, onChange, onSubmit)
- Browser-specific APIs (localStorage, window, document)
- React hooks (useState, useEffect, useReducer, useContext)
- Context providers requiring client-side state
- Third-party libraries requiring browser environment

## Implementation Patterns

### 1. Component Hierarchy
```tsx
// ✅ Server Component (default)
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id);
  return (
    <div>
      <ProductDetails product={product} />
      <AddToCartButton productId={product.id} /> {/* Client component */}
    </div>
  );
}

// ✅ Client Component (minimal boundary)
"use client";
export function AddToCartButton({ productId }: { productId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  // Interactive logic here
}
```

### 2. Data Fetching Strategy
```tsx
// ✅ Server Components - fetch data server-side
async function UserProfile({ userId }: { userId: string }) {
  const user = await getUserData(userId);
  return <UserCard user={user} />;
}

// ✅ Pass serialized data to client components
"use client";
function InteractiveUserCard({ user }: { user: SerializedUser }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div onClick={() => setIsExpanded(!isExpanded)}>
      {/* Interactive UI */}
    </div>
  );
}
```

### 3. Type-Safe Imports
```tsx
// ✅ Type-only imports
import type { User, Product } from '@/lib/types';
import type { ReactNode, PropsWithChildren } from 'react';

// ✅ Regular imports for runtime usage
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
```

## File Organization Guidelines

### Component Structure
```tsx
// ComponentName.tsx
import type { ComponentProps } from './types';

interface ComponentNameProps {
  // Props definition with clear types
}

export default function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // Implementation
}

// Named exports for related utilities
export { type ComponentNameProps };
```

### Directory Organization
```
src/components/
├── ui/           # Base UI components (buttons, inputs)
├── layout/       # Layout components (header, footer)
├── feature/      # Feature-specific components
└── providers/    # Context providers (client components)
```

## Performance Optimization

### Server Component Benefits
```tsx
// ✅ Leverage server-side rendering
async function DataTable() {
  const data = await fetchData(); // No loading state needed
  return <Table data={data} />;   // Rendered on server
}
```

### Client Component Optimization
```tsx
// ✅ Lazy loading for large client components
const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart />
    </Suspense>
  );
}
```

## Error Handling

### Route-Level Error Boundaries
```tsx
// app/dashboard/error.tsx
"use client";
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong in the dashboard!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Component-Level Error Handling
```tsx
// ✅ Graceful degradation in server components
async function UserAvatar({ userId }: { userId: string }) {
  try {
    const user = await getUser(userId);
    return <img src={user.avatar} alt={user.name} />;
  } catch {
    return <DefaultAvatar />; // Fallback UI
  }
}
```

## Testing Considerations

### Server Component Testing
```tsx
// ✅ Test server components with data mocking
test('ProductPage renders product details', async () => {
  const mockProduct = { id: '1', name: 'Test Product' };
  jest.mocked(fetchProduct).mockResolvedValue(mockProduct);
  
  render(await ProductPage({ params: { id: '1' } }));
  expect(screen.getByText('Test Product')).toBeVisible();
});
```

### Client Component Testing
```tsx
// ✅ Test client components with user interactions
test('AddToCartButton handles click', async () => {
  render(<AddToCartButton productId="1" />);
  
  const button = screen.getByRole('button', { name: /add to cart/i });
  await user.click(button);
  
  expect(button).toHaveAttribute('aria-busy', 'true');
});
```

## Common Patterns

### Composition over Prop Drilling
```tsx
// ✅ Use composition to avoid prop drilling
function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
```

### Shared Logic Extraction
```tsx
// ✅ Extract reusable logic to utilities
// src/lib/format.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// ✅ Use in components
function ProductPrice({ price }: { price: number }) {
  return <span>{formatCurrency(price)}</span>;
}
```

## Security Considerations

### Input Sanitization
```tsx
// ✅ Sanitize user inputs
function UserComment({ comment }: { comment: string }) {
  const sanitizedComment = sanitizeHtml(comment);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedComment }} />;
}
```

### Safe Redirects
```tsx
// ✅ Validate redirect URLs
function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const redirectUrl = isValidInternalUrl(from) ? from : '/dashboard';
  
  // Use validated redirect URL
}
```

## Migration Strategy

### Converting Client to Server
```tsx
// Before: Unnecessary client component
"use client";
function ProductList({ products }: { products: Product[] }) {
  return (
    <div>
      {products.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}

// After: Server component (no interactivity needed)
function ProductList({ products }: { products: Product[] }) {
  return (
    <div>
      {products.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
```

### Adding Client Interactivity
```tsx
// Before: Server component
function ProductCard({ product }: { product: Product }) {
  return <div>{product.name}</div>;
}

// After: Compose with client component for interactivity
function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      {product.name}
      <FavoriteButton productId={product.id} /> {/* Client component */}
    </div>
  );
}
```

## Decision Framework

When deciding between Server and Client Components:

1. **Does it need interactivity?** (event handlers, state) → Client
2. **Does it use browser APIs?** (localStorage, window) → Client  
3. **Does it fetch data?** → Prefer Server
4. **Is it static content?** → Server
5. **When in doubt?** → Start with Server, convert if needed

## Quality Checklist

- [ ] Components have single responsibility
- [ ] Props are properly typed with interfaces
- [ ] No unnecessary `"use client"` directives
- [ ] Error boundaries in place for fallback UI
- [ ] Accessibility attributes present (ARIA, semantic HTML)
- [ ] Performance optimizations applied (lazy loading, memoization)
- [ ] Test coverage for critical functionality