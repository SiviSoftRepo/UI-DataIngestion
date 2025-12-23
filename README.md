# File Ingestion & Column Mapping Configuration

A React TypeScript application for configuring file ingestion metadata and column-level mapping rules.

## Features

- **Panel 1 - Basic File Information**: Configure file ingestion metadata including department name, file name, project name, target index name, and composite key separator
- **Panel 2 - Column Mapping Configuration**: Dynamically add/remove column configurations with comprehensive validation rules
- **Dynamic Field Enable/Disable**: Conditional field visibility based on data type and other selections
- **Comprehensive Validation**: Real-time validation with error messages
- **JSON Export**: Generate and download configuration as JSON file

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── BasicFileInfoPanel.tsx    # Panel 1 - Basic file information
│   ├── BasicFileInfoPanel.css
│   ├── ColumnMappingPanel.tsx    # Panel 2 - Column mapping container
│   ├── ColumnMappingPanel.css
│   ├── ColumnRow.tsx             # Individual column row component
│   └── ColumnRow.css
├── types/
│   └── index.ts                  # TypeScript type definitions
├── utils/
│   ├── validation.ts             # Validation logic
│   └── jsonGenerator.ts          # JSON generation and download
├── App.tsx                        # Main application component
├── App.css
├── index.tsx                      # Application entry point
└── index.css
```

## Usage

1. **Fill Basic File Information**:
   - Enter department name (alphabets and spaces only)
   - Enter file name (must have .csv extension)
   - Enter project name (alphanumeric)
   - Enter target index name (lowercase, underscores allowed)
   - Enter composite key separator (single special character)

2. **Configure Columns**:
   - Click "Add Row" to add a new column configuration
   - Fill in all mandatory fields for each column
   - Configure conditional fields based on data type:
     - **Date type**: Enable date validation and date format
     - **String type**: Enable special character acceptance
     - **Composite Key**: Set composite key order when enabled
   - Use the delete icon to remove unwanted rows

3. **Save Configuration**:
   - **Save**: Validates all fields and downloads JSON configuration
   - **Save Draft**: Saves current state without validation
   - **Cancel**: Discards all changes

## Validation Rules

### Basic File Information
- Department Name: Required, alphabets and spaces only
- File Name: Required, must have .csv extension
- Project Name: Required, alphanumeric
- Target Index Name: Required, lowercase with underscores only
- Composite Key Separator: Required, single special character

### Column Configuration
- Column Name: Required
- Mapped Column Name: Required, must be unique
- Data Type: Required (String, Integer, Date, Boolean, Keyword)
- Allow Null: Required (True/False)
- Unique: Required (True/False)
- Composite Key Order: Required when Composite Key is True, must be unique
- Date Format: Required when Data Type is Date
- Special Character: Required when Accept Special Character is True and Data Type is String

## JSON Output Structure

The application generates a JSON file with the following structure:

```json
{
  "uuid": "generated-uuid",
  "createdby": "System",
  "createddate": "ISO timestamp",
  "fileConfiguration": [
    {
      "deptName": "Department Name",
      "fileName": "file.csv",
      "projectName": "Project",
      "indexname": "target_index",
      "compositeKeySeparator": "-",
      "columnConfiguration": [
        {
          "columnName": "Column Name",
          "mappedColumnName": "mapped_name",
          "dataType": "String",
          "compositeKey": {
            "compositekey": true,
            "compositekeyOrder": 1
          },
          "specialCharacter": {
            "acceptspecialcharacter": false,
            "specialCharacter": []
          },
          "allowNull": false,
          "unique": false
        }
      ]
    }
  ]
}
```

## Technologies Used

- React 18
- TypeScript
- CSS3
- HTML5

## License

This project is private and proprietary.

