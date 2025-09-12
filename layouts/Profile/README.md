# Profile Components

## ProfileCompany.jsx

A comprehensive company profile management component with form fields for business information and logo upload.

### Features

- **Company Logo Upload** - Image picker with preview
- **Business Type Dropdown** - Searchable dropdown with predefined options
- **Form Validation** - Required field validation
- **Data Persistence** - Saves to SecureStore
- **Network Integration** - API calls for profile updates
- **Loading States** - User feedback during operations
- **Error Handling** - Comprehensive error management

### Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Type of Business | Dropdown | Yes | Business category selection |
| Business Name | Text | Yes | Company name |
| Contact Number | Text | Yes | Phone number |
| Email | Text | Yes | Email address |
| Building | Text | Yes | Building name |
| Address | Text | Yes | Street address |
| City | Text | Yes | City name |
| Province | Text | Yes | Province/state |
| Postal Code | Text | Yes | ZIP/postal code |
| Logo | Image | No | Company logo upload |

### API Endpoints

- `POST /api/company/update-profile` - Update company profile
- `GET /api/auth/me` - Get current user data

### Usage

```jsx
import ProfileCompany from './layouts/Profile/ProfileCompany';

<ProfileCompany navigation={navigation} />
```

### Dependencies

- `expo-image-picker` - Image selection
- `expo-secure-store` - Data persistence
- `react-native-paper` - UI components
- Custom dropdown component
- HTTP helper for API calls

### Styling

The component uses a card-based layout with:
- Clean white background
- Rounded corners and shadows
- Consistent spacing
- Theme-aware colors
- Responsive design
