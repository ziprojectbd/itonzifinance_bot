# iTonzi Admin Panel - API Services

A comprehensive API service layer built with Axios for the iTonzi Admin Panel, providing type-safe API calls with advanced features like caching, retry logic, and React hooks.

## 🚀 Features

- **Type-safe API calls** with TypeScript
- **Automatic authentication** with JWT tokens
- **Request/Response interceptors** for global error handling
- **Built-in caching** with TTL support
- **Retry logic** with exponential backoff
- **React hooks** for easy integration
- **File upload** with progress tracking
- **Comprehensive error handling**
- **Pagination support**
- **Real-time data fetching**
- **Live crypto market data** from CoinGecko API (Free, no API key required)
- **EVM wallet integration** (MetaMask support)
- **Crypto trading interface** with buy/sell functionality
- **Portfolio management** with real-time balance tracking

## 📁 Project Structure

```
src/services/api/
├── config.ts                 # Axios configuration and interceptors
├── index.ts                  # Main exports and utilities
├── types/
│   └── index.ts             # TypeScript type definitions
├── endpoints/
│   ├── auth.ts              # Authentication API
│   ├── users.ts             # User management API
│   ├── tasks.ts             # Task management API
│   ├── payments.ts          # Payment management API
│   ├── analytics.ts         # Analytics and dashboard API
│   ├── notifications.ts     # Notification management API
│   ├── database.ts          # Database management API
│   └── settings.ts          # System settings API
└── hooks/
    └── useApi.ts            # React hooks for API calls
```

## 🛠 Installation

The API services are already configured in this project. Axios is installed as a dependency.

## 📖 Usage

### Basic API Usage

```typescript
import { usersApi, authApi, apiUtils } from '@/services/api';

// Get all users
const users = await usersApi.getUsers({ page: 1, limit: 10 });

// Create a new user
const newUser = await usersApi.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});

// Handle errors
try {
  const data = await usersApi.getUserById('123');
} catch (error) {
  const errorMessage = apiUtils.formatErrorMessage(error);
  console.error(errorMessage);
}
```

### Using React Hooks

```typescript
import { useApi, useMutation } from '@/services/api/hooks/useApi';
import { usersApi } from '@/services/api';

// Query hook
function UsersList() {
  const { data: users, loading, error, refetch } = useApi(
    () => usersApi.getUsers({ page: 1, limit: 10 }),
    {
      cache: true,
      cacheKey: 'users-list',
      retries: 3
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {users?.data.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}

// Mutation hook
function CreateUser() {
  const { mutate, loading, error } = useMutation(
    (userData) => usersApi.createUser(userData),
    {
      onSuccess: (data) => {
        console.log('User created:', data);
      },
      onError: (error) => {
        console.error('Failed to create user:', error);
      }
    }
  );

  const handleSubmit = (formData) => {
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

### Authentication

```typescript
import { authApi } from '@/services/api';

// Login
const loginResult = await authApi.login({
  email: 'admin@itonzi.com',
  password: 'password123'
});

// Check if user is authenticated
const isAuthenticated = authApi.isAuthenticated();

// Get current user
const currentUser = authApi.getCurrentUser();

// Logout
await authApi.logout();
```

### File Upload with Progress

```typescript
import { apiUtils } from '@/services/api';

const handleFileUpload = async (file: File) => {
  try {
    const result = await apiUtils.uploadFileWithProgress(
      '/api/upload',
      file,
      (progress) => {
        console.log(`Upload progress: ${progress}%`);
      },
      { category: 'avatar' }
    );
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Caching

```typescript
import { apiUtils } from '@/services/api';

// Create a cache instance
const cache = apiUtils.createApiCache();

// Cache data
cache.set('users', userData, 5 * 60 * 1000); // 5 minutes

// Retrieve cached data
const cachedUsers = cache.get('users');

// Generate cache key
const cacheKey = apiUtils.generateCacheKey('users', { page: 1, limit: 10 });
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# CoinMarketCap API Configuration
# Get your API key from: https://coinmarketcap.com/api/
VITE_COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here
```

### Custom Configuration

### Crypto Trading Features Setup

The application includes comprehensive crypto trading features with live market data:

#### 1. CoinGecko API Setup (Free, No API Key Required)

The application uses **CoinGecko API** which is completely free and doesn't require any API key setup. The live market data will work immediately without any configuration.

**Features:**
- ✅ No API key required
- ✅ Free to use
- ✅ Real-time cryptocurrency prices
- ✅ Market cap, volume, and 24h changes
- ✅ Top 100 cryptocurrencies by market cap

#### 2. Features Available

- **Live Market Data**: Real-time cryptocurrency prices, market cap, volume, and 24h changes
- **Portfolio Management**: Track your crypto assets with real-time balance updates
- **EVM Wallet Integration**: Connect MetaMask or other EVM-compatible wallets
- **Trading Interface**: Buy/sell cryptocurrencies with simulated order execution
- **Order History**: Track all your trading activities
- **Market Analysis**: View detailed market information for top cryptocurrencies

#### 3. Wallet Modal Features

The Wallet Modal (`src/FooterButton/Modals/WalletModal.tsx`) provides:

- **Assets Tab**: View your crypto portfolio with real-time prices
- **Trading Tab**: 
  - **Market**: Live cryptocurrency market data
  - **Trade**: Buy/sell interface with price charts
  - **Orders**: Order history and status tracking

#### 4. API Fallback

If the CoinGecko API is temporarily unavailable, the application will use fallback simulated data to ensure the interface remains functional.

```typescript
import { apiClient } from '@/services/api';

// Set custom headers
apiClient.defaults.headers.common['X-Custom-Header'] = 'value';

// Set custom timeout
apiClient.defaults.timeout = 60000;

// Add request interceptor
apiClient.interceptors.request.use((config) => {
  // Custom logic here
  return config;
});
```

## 📚 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### Users
- `GET /users` - Get all users (paginated)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/search` - Search users
- `GET /users/stats` - Get user statistics

### Tasks
- `GET /tasks` - Get all tasks (paginated)
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `PATCH /tasks/:id/status` - Change task status
- `PATCH /tasks/:id/assign` - Assign task to user

### Payments
- `GET /payments` - Get all payments (paginated)
- `GET /payments/:id` - Get payment by ID
- `POST /payments` - Create new payment
- `PUT /payments/:id` - Update payment
- `DELETE /payments/:id` - Delete payment
- `PATCH /payments/:id/status` - Change payment status
- `POST /payments/:id/process` - Process payment

### Analytics
- `GET /analytics/dashboard` - Get dashboard statistics
- `GET /analytics/data` - Get analytics data
- `GET /analytics/user-growth` - Get user growth data
- `GET /analytics/task-completion` - Get task completion data
- `GET /analytics/revenue` - Get revenue data

### Notifications
- `GET /notifications` - Get all notifications (paginated)
- `GET /notifications/:id` - Get notification by ID
- `POST /notifications` - Create new notification
- `PUT /notifications/:id` - Update notification
- `DELETE /notifications/:id` - Delete notification
- `PATCH /notifications/:id/read` - Mark as read

### Database
- `GET /database/tables` - Get all database tables
- `GET /database/tables/:name` - Get table structure
- `GET /database/tables/:name/data` - Get table data
- `POST /database/query` - Execute custom query
- `GET /database/backups` - Get all backups
- `POST /database/backups` - Create backup

### Settings
- `GET /settings` - Get all settings
- `GET /settings/:key` - Get setting by key
- `PUT /settings/:key` - Update setting
- `GET /settings/general` - Get general settings
- `PUT /settings/general` - Update general settings

## 🎯 Best Practices

### Error Handling

```typescript
import { apiUtils } from '@/services/api';

try {
  const data = await apiCall();
} catch (error) {
  if (apiUtils.isAuthError(error)) {
    // Handle authentication error
    redirectToLogin();
  } else if (apiUtils.isNetworkError(error)) {
    // Handle network error
    showNetworkError();
  } else if (apiUtils.isServerError(error)) {
    // Handle server error
    showServerError();
  } else {
    // Handle other errors
    const message = apiUtils.formatErrorMessage(error);
    showError(message);
  }
}
```

### Retry Logic

```typescript
import { apiUtils } from '@/services/api';

// Retry API call with exponential backoff
const data = await apiUtils.retryApiCall(
  () => apiCall(),
  3, // max retries
  1000 // base delay in ms
);
```

### Debouncing API Calls

```typescript
import { apiUtils } from '@/services/api';

const debouncedSearch = apiUtils.debounce(
  (query) => searchApi.search(query),
  300 // 300ms delay
);

// Use in input onChange
<input onChange={(e) => debouncedSearch(e.target.value)} />
```

## 🔒 Security

- JWT tokens are automatically included in requests
- Tokens are stored securely in localStorage
- Automatic token refresh on 401 errors
- CORS protection
- Rate limiting support

## 🧪 Testing

```typescript
import { apiClient } from '@/services/api';

// Mock API responses for testing
jest.mock('@/services/api', () => ({
  usersApi: {
    getUsers: jest.fn().mockResolvedValue({
      data: mockUsers,
      pagination: mockPagination
    })
  }
}));
```

## 📝 Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include error handling
4. Add JSDoc comments for complex functions
5. Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions, please contact the development team or create an issue in the repository. 