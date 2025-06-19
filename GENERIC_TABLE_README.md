# GenericTable Component

A comprehensive, reusable table component built with Mantine UI, TailwindCSS, and React Icons that provides sorting, searching, filtering, and pagination functionality.

## Features

- ✅ **Sorting**: Click column headers to sort data
- ✅ **Searching**: Global search across all columns
- ✅ **Filtering**: Dropdown filters for each column
- ✅ **Date Range Filtering**: Special date range inputs for date columns
- ✅ **Excel Export**: Export data to Excel (.xlsx) and CSV formats
- ✅ **Filtered Export**: Export only filtered/searched data with metadata
- ✅ **Pagination**: Built-in pagination with configurable page size
- ✅ **Row Actions**: Preview button for detailed row data
- ✅ **Responsive**: Mobile-friendly design
- ✅ **Customizable**: Custom cell renderers and column configuration
- ✅ **Modal Integration**: Built-in modal for detailed user previews

## Components

### GenericTable

Main table component with all features.

### UserPreviewModal

Modal component for displaying detailed user information with role-specific layouts.

## Usage

### Basic Usage

```jsx
import GenericTable from "./components/GenericTable";

const MyComponent = () => {
  const data = [
    { id: 1, name: "John", role: "Admin", email: "john@example.com" },
    { id: 2, name: "Jane", role: "User", email: "jane@example.com" },
  ];

  const columns = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "email", label: "Email" },
  ];

  return <GenericTable data={data} columns={columns} title="Users" />;
};
```

### Advanced Usage with Custom Renderers

```jsx
import { Badge, Text } from "@mantine/core";
import GenericTable from "./components/GenericTable";

const columns = [
  {
    key: "name",
    label: "Full Name",
    render: (value) => <Text fw={500}>{value}</Text>,
  },
  {
    key: "role",
    label: "Role",
    render: (value) => (
      <Badge color={value === "Admin" ? "red" : "blue"}>{value}</Badge>
    ),
  },
  {
    key: "skills",
    label: "Skills",
    render: (value) => (
      <div className="flex flex-wrap gap-1">
        {value.map((skill, index) => (
          <Badge key={index} size="sm" variant="light">
            {skill}
          </Badge>
        ))}
      </div>
    ),
  },
];
```

### Date Range Filtering

For date columns, you can enable date range filtering by adding `type: 'date'` to the column configuration:

```jsx
const columns = [
  {
    key: "created_at",
    label: "Date Created",
    type: "date", // This enables date range filtering
    render: (value) => (
      <Text size="sm">
        {value ? new Date(value).toLocaleDateString() : "N/A"}
      </Text>
    ),
  },
];
```

The component will automatically detect date columns and provide "From" and "To" date inputs instead of dropdown filters.

```jsx
import { useState } from "react";
import GenericTable from "./components/GenericTable";
import UserPreviewModal from "./components/UserPreviewModal";

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePreview = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <>
      <GenericTable
        data={users}
        columns={columns}
        onRowPreview={handlePreview}
      />

      <UserPreviewModal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </>
  );
};
```

## Props

### GenericTable Props

| Prop           | Type       | Default        | Description                            |
| -------------- | ---------- | -------------- | -------------------------------------- |
| `data`         | `Array`    | `[]`           | Array of data objects to display       |
| `columns`      | `Array`    | `[]`           | Column configuration array             |
| `searchable`   | `boolean`  | `true`         | Enable/disable search functionality    |
| `sortable`     | `boolean`  | `true`         | Enable/disable sorting functionality   |
| `filterable`   | `boolean`  | `true`         | Enable/disable filtering functionality |
| `exportable`   | `boolean`  | `true`         | Enable/disable export functionality    |
| `onRowPreview` | `function` | `null`         | Callback function for row preview      |
| `rowsPerPage`  | `number`   | `10`           | Number of rows per page                |
| `title`        | `string`   | `"Data Table"` | Table title                            |

### Column Configuration

Each column object can have the following properties:

| Property     | Type       | Default      | Description                                             |
| ------------ | ---------- | ------------ | ------------------------------------------------------- |
| `key`        | `string`   | **required** | Data object key (supports nested keys like 'user.name') |
| `label`      | `string`   | **required** | Column header label                                     |
| `type`       | `string`   | `null`       | Column type - use 'date' to enable date range filtering |
| `render`     | `function` | `null`       | Custom render function `(value, item) => ReactNode`     |
| `sortable`   | `boolean`  | `true`       | Enable/disable sorting for this column                  |
| `filterable` | `boolean`  | `true`       | Enable/disable filtering for this column                |

### UserPreviewModal Props

| Prop      | Type       | Default      | Description                 |
| --------- | ---------- | ------------ | --------------------------- |
| `opened`  | `boolean`  | `false`      | Modal open state            |
| `onClose` | `function` | **required** | Callback to close modal     |
| `user`    | `object`   | `null`       | User data object to display |

## Data Structure

The UserPreviewModal component expects user data with the following structure:

```javascript
{
  id: "string",
  full_name: "string",
  role: "Mentor" | "Mentee" | "Admin",
  phone_number: "string",
  email: "string",
  created_at: "ISO date string",
  user_data: {
    // Mentor-specific fields
    working_field: "string",
    working_level: "string",
    working_title: "string",
    working_company: "string",
    working_years_of_experience: "string",
    prefer_mentoring_field: ["array of strings"],
    prefer_mentoring_topic: ["array of strings"],
    prefer_mentoring_softskills: ["array of strings"],
    prefer_mentee_gender: "string",
    prefer_mentee_working_style: "string",

    // Mentee-specific fields
    university: "string",
    major: "string",
    student_year: "string",
    sun_id: "string",
    is_internship: "Yes" | "No",
    internship_company: "string",
    internship_position: "string",
    prefer_mentoring_fields: ["array of strings"],
    prefer_mentoring_topics: ["array of strings"],
    prefer_mentor_gender: "string",
    prefer_mentor_working_style: "string",
    prefer_international_mentor: "string",

    // Common fields
    commitment: "string",
    self_introduction: "string"
  }
}
```

## Styling

The components use:

- **Mantine UI** for core components
- **TailwindCSS** for utility classes
- **React Icons** (Feather icons) for iconography

Make sure you have these dependencies installed and configured in your project.

## Dependencies

```json
{
  "@mantine/core": "^8.x.x",
  "@mantine/dates": "^8.x.x",
  "react-icons": "^5.x.x",
  "tailwindcss": "^4.x.x",
  "xlsx": "^0.x.x"
}
```

## Export Features

The GenericTable now includes powerful export capabilities:

### Export Options

- **Excel Export (.xlsx)**: Export all visible data to Excel format
- **CSV Export**: Export data to comma-separated values format
- **Filtered Export**: Export only the currently filtered/searched data with metadata

### Export Metadata (Excel only)

When using filtered export, an additional "Export Info" sheet is created containing:

- Export timestamp
- Total number of records
- Applied search terms
- Active filters
- Date range filters

### Export Data Processing

- **Date Formatting**: Automatically formats dates for readability
- **Array Handling**: Converts arrays to comma-separated strings
- **Nested Objects**: Handles nested data structures
- **Auto-sizing**: Columns are automatically sized for optimal viewing
- **Filename Generation**: Includes timestamp to prevent overwrites

### Usage Example

```jsx
<GenericTable
  data={users}
  columns={columns}
  exportable={true} // Enable export functionality
  title="User Management"
/>
```

## Examples

See `ExampleTableUsage.jsx` for a complete working example.

The `ManageUsersPage.jsx` demonstrates real-world usage with user management functionality.
