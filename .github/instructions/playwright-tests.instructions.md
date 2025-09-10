---
applyTo: "**/tests/**/*.spec.ts"
version: 2
scope: playwright-e2e-testing
---

# Playwright E2E Testing Instructions

## Core Testing Principles

Follow project principles: **DRY**, **SRP**, **Deterministic**, and **Maintainable**.

### Test Independence
- Each test must be completely independent
- No shared state between tests
- No assumptions about test execution order
- Clean slate for every test run

### Reliability First
- Use Playwright's auto-waiting mechanisms
- Avoid arbitrary `page.waitForTimeout()`
- Prefer explicit waiting for conditions
- Design tests to be deterministic and fast

## Locator Strategy

### Accessibility-First Approach
```typescript
// ✅ Preferred: Accessible selectors
await page.getByRole('button', { name: 'Submit' });
await page.getByLabel('Email address');
await page.getByPlaceholder('Enter your email');
await page.getByText('Welcome back');

// ✅ Semantic HTML selectors
await page.getByRole('navigation');
await page.getByRole('main');
await page.getByRole('banner');

// ⚠️ Use data-testid sparingly (when no stable accessible option exists)
await page.getByTestId('complex-component-state');
```

### Locator Best Practices
```typescript
// ✅ Specific and stable
const submitButton = page.getByRole('button', { name: 'Create Account' });

// ✅ Combine locators for precision
const emailField = page.getByRole('form').getByLabel('Email');

// ❌ Avoid fragile selectors
const button = page.locator('.btn-primary:nth-child(2)');
```

## Test Organization

### File Structure
```typescript
// ✅ Group related functionality
test.describe('Authentication Flow', () => {
  test.describe('Login Process', () => {
    test('successful login redirects to dashboard', async ({ page }) => {
      // Test implementation
    });
    
    test('invalid credentials show error message', async ({ page }) => {
      // Test implementation
    });
  });
  
  test.describe('Registration Process', () => {
    // Registration tests
  });
});
```

### Test Naming
```typescript
// ✅ Describe user-observable outcomes
test('user can create account and access dashboard', async ({ page }) => {});
test('form validation prevents submission with invalid email', async ({ page }) => {});
test('logout clears session and redirects to home', async ({ page }) => {});

// ❌ Avoid implementation details
test('POST request to /api/auth/login returns 200', async ({ page }) => {});
```

## Helper Functions and Utilities

### Authentication Helpers
```typescript
// tests/helpers/auth.ts
export async function loginAsUser(page: Page, credentials?: { email: string; password: string }) {
  const { email = 'demo@example.com', password = 'password' } = credentials || {};
  
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  // Wait for successful login
  await page.waitForURL('/dashboard');
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: 'Logout' }).click();
  await page.waitForURL('/');
}
```

### Navigation Helpers
```typescript
// tests/helpers/navigation.ts
export async function navigateToProtectedRoute(page: Page, route: string) {
  await page.goto(route);
  
  // Handle potential redirect to login
  if (page.url().includes('/login')) {
    await loginAsUser(page);
    await page.waitForURL(route);
  }
}
```

### Form Helpers
```typescript
// tests/helpers/forms.ts
export async function fillForm(page: Page, formData: Record<string, string>) {
  for (const [label, value] of Object.entries(formData)) {
    await page.getByLabel(label).fill(value);
  }
}

export async function submitForm(page: Page, submitButtonText = 'Submit') {
  await page.getByRole('button', { name: submitButtonText }).click();
}
```

## Assertion Patterns

### Explicit and Meaningful Assertions
```typescript
// ✅ Specific assertions
await expect(page.getByRole('alert')).toHaveText('Account created successfully');
await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();
await expect(page).toHaveURL('/dashboard');

// ✅ Visual verification
await expect(page.getByRole('main')).toBeVisible();
await expect(page.getByText('Welcome, John')).toBeVisible();

// ✅ State verification
await expect(page.getByRole('checkbox', { name: 'Remember me' })).toBeChecked();
```

### Error State Testing
```typescript
test('form validation displays appropriate error messages', async ({ page }) => {
  await page.goto('/register');
  
  // Submit empty form
  await page.getByRole('button', { name: 'Create Account' }).click();
  
  // Verify validation errors
  await expect(page.getByText('Email is required')).toBeVisible();
  await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
  
  // Verify form is not submitted
  await expect(page).toHaveURL('/register');
});
```

## Performance and Efficiency

### Minimize Network Requests
```typescript
// ✅ Mock API responses when testing UI behavior
test('loading state displays correctly', async ({ page }) => {
  // Mock slow API response
  await page.route('**/api/users', async (route) => {
    await page.waitForTimeout(2000); // Simulate slow response
    await route.fulfill({ json: { users: [] } });
  });
  
  await page.goto('/users');
  await expect(page.getByText('Loading...')).toBeVisible();
  await expect(page.getByText('No users found')).toBeVisible();
});
```

### Efficient Test Setup
```typescript
// ✅ Use beforeEach for common setup
test.describe('Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/dashboard');
  });
  
  test('displays user profile information', async ({ page }) => {
    await expect(page.getByText('Welcome, Demo User')).toBeVisible();
  });
});
```

## Error Handling and Debugging

### Comprehensive Error Context
```typescript
test('user registration flow', async ({ page }) => {
  test.info().annotations.push({
    type: 'feature',
    description: 'Tests the complete user registration process including validation'
  });
  
  try {
    await page.goto('/register');
    await fillForm(page, {
      'Full Name': 'John Doe',
      'Email': 'john@example.com',
      'Password': 'securePassword123'
    });
    
    await submitForm(page, 'Create Account');
    await expect(page).toHaveURL('/dashboard');
    
  } catch (error) {
    // Capture screenshot on failure
    await page.screenshot({ path: 'test-failure-registration.png' });
    throw error;
  }
});
```

### Conditional Logic for Edge Cases
```typescript
test('handles slow network conditions gracefully', async ({ page }) => {
  // Simulate slow network
  await page.context().setOffline(true);
  await page.goto('/dashboard');
  
  // Check for offline indicator or fallback UI
  await expect(page.getByText('You are offline')).toBeVisible();
  
  // Restore connection
  await page.context().setOffline(false);
  await page.reload();
  
  await expect(page.getByText('Welcome to Dashboard')).toBeVisible();
});
```

## Security Testing

### Authentication and Authorization
```typescript
test.describe('Security: Authentication', () => {
  test('unauthenticated users cannot access protected routes', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
  
  test('logout clears authentication state', async ({ page }) => {
    await loginAsUser(page);
    await logout(page);
    
    // Attempt to access protected route
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
```

### Input Validation and Sanitization
```typescript
test.describe('Security: Input Validation', () => {
  test('prevents XSS in user inputs', async ({ page }) => {
    const maliciousScript = '<script>alert("xss")</script>';
    
    await page.goto('/profile');
    await page.getByLabel('Bio').fill(maliciousScript);
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify script is not executed (content is escaped)
    const bioContent = await page.getByTestId('user-bio').textContent();
    expect(bioContent).toBe(maliciousScript); // Should be text, not executed
  });
});
```

## Accessibility Testing

### ARIA and Semantic HTML Validation
```typescript
test.describe('Accessibility', () => {
  test('form has proper labels and ARIA attributes', async ({ page }) => {
    await page.goto('/login');
    
    // Verify form accessibility
    const form = page.getByRole('form');
    await expect(form).toBeVisible();
    
    // Check required field indicators
    await expect(page.getByLabel('Email')).toHaveAttribute('required');
    await expect(page.getByLabel('Password')).toHaveAttribute('required');
    
    // Verify ARIA attributes
    const submitButton = page.getByRole('button', { name: 'Sign In' });
    await expect(submitButton).toHaveAttribute('type', 'submit');
  });
  
  test('error messages are properly announced', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Verify error is associated with input
    const emailError = page.getByRole('alert').filter({ hasText: 'Email is required' });
    await expect(emailError).toBeVisible();
  });
});
```

## Data Management

### Test Data Strategy
```typescript
// tests/fixtures/testData.ts
export const TEST_USERS = {
  validUser: {
    email: 'test@example.com',
    password: 'ValidPassword123!',
    name: 'Test User'
  },
  adminUser: {
    email: 'admin@example.com', 
    password: 'AdminPassword123!',
    name: 'Admin User'
  }
} as const;

// Usage in tests
test('admin can access admin panel', async ({ page }) => {
  await loginAsUser(page, TEST_USERS.adminUser);
  await page.goto('/admin');
  await expect(page.getByText('Admin Dashboard')).toBeVisible();
});
```

## Configuration and Environment

### Environment-Specific Testing
```typescript
// playwright.config.ts integration
test('respects environment configuration', async ({ page }) => {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';
  await page.goto(`${baseURL}/health`);
  await expect(page.getByText('OK')).toBeVisible();
});
```

## Maintenance and Refactoring

### Test Refactoring Guidelines
1. **Extract repetitive actions** into helper functions
2. **Parameterize tests** for similar scenarios with different data
3. **Use Page Object Model** for complex applications
4. **Regular cleanup** of obsolete tests

### Code Review Checklist
- [ ] Tests are independent and deterministic
- [ ] Accessible selectors used where possible
- [ ] Proper error handling and debugging context
- [ ] No arbitrary waits or timeouts
- [ ] Helper functions extracted for reusable logic
- [ ] Meaningful test names describing user outcomes
- [ ] Appropriate use of test.describe for grouping
- [ ] Security and accessibility considerations addressed

## Anti-Patterns to Avoid

```typescript
// ❌ Avoid these patterns
test('bad test example', async ({ page }) => {
  // Don't use arbitrary timeouts
  await page.waitForTimeout(5000);
  
  // Don't rely on fragile selectors
  await page.locator('.btn:nth-child(3)').click();
  
  // Don't test implementation details
  expect(mockApi.calledWith('/api/users')).toBe(true);
  
  // Don't make tests dependent on each other
  // (assuming previous test created user)
  await page.goto('/users/123');
});
```

Follow these guidelines to create reliable, maintainable, and meaningful E2E tests that provide confidence in your application's critical user journeys.
