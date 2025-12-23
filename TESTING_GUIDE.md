# Testing Guide - File Ingestion Configuration

## What This Application Does

This is a **File Ingestion & Column Mapping Configuration** tool that allows administrators/data engineers to:

1. **Configure file ingestion metadata** - Set up basic information about CSV files that will be ingested into an Elasticsearch system
2. **Define column mapping rules** - Map CSV columns to target system fields with validation rules
3. **Generate configuration JSON** - Export the configuration as a JSON file that backend services can use to process file ingestion

### Key Features:
- ✅ Two-panel interface for organized configuration
- ✅ Dynamic row addition/removal for column configurations
- ✅ Real-time validation with error messages
- ✅ Conditional field enable/disable based on selections
- ✅ JSON export functionality

---

## How to Test This Application

### Step 1: Start the Application

```bash
npm start
```

The application will open at `http://localhost:3000`

---

### Step 2: Test Basic File Information Panel (Panel 1)

#### Test Case 1: Valid Input
1. **Department Name**: Enter `Denver` (or any alphabetic name with spaces)
2. **File Name**: Enter `HP_reg_class_1gb_with_missing.csv`
3. **Project Name**: Enter `CC` (or any alphanumeric value)
4. **Target Index Name**: Enter `sanitytest2` (lowercase, underscores allowed)
5. **Composite Key Separator**: Enter `-` (single special character)

**Expected Result**: No error messages, all fields accept the input

#### Test Case 2: Validation Errors
Test each field with invalid input:

1. **Department Name**:
   - Try: `Denver123` or `Denver@`
   - **Expected**: Red border + error message "Department Name must contain only alphabets and spaces"

2. **File Name**:
   - Try: `file.txt` or `file`
   - **Expected**: Error "File Name must have .csv extension"

3. **Project Name**:
   - Try: `Project-Name` or `Project Name`
   - **Expected**: Error "Project Name must be alphanumeric"

4. **Target Index Name**:
   - Try: `TestIndex` or `test-index`
   - **Expected**: Error "Target Index Name must be lowercase with underscores only"

5. **Composite Key Separator**:
   - Try: `--` or `ab`
   - **Expected**: Error "Composite Key Separator must be a single character"
   - Try: `a` (regular character)
   - **Expected**: Error "Composite Key Separator must be a special character"

#### Test Case 3: Tooltips
- Hover over the ℹ️ icon next to each field
- **Expected**: Tooltip appears explaining the field

---

### Step 3: Test Column Mapping Panel (Panel 2)

#### Test Case 4: Add Rows
1. Click the **"+ Add Row"** button
2. **Expected**: A new row appears in the table with empty fields

#### Test Case 5: Basic Column Configuration
Fill in a simple column:

1. **Column Name**: `Country`
2. **Mapped Column Name**: `country`
3. **Data Type**: Select `String`
4. **Composite Key**: Select `False`
5. **Allow Null**: Select `True`
6. **Accept Special Character**: Select `False`
7. **Unique**: Select `False`

**Expected**: No errors, fields are filled correctly

#### Test Case 6: Date Type Column
1. Click **"+ Add Row"**
2. Fill in:
   - **Column Name**: `Date`
   - **Mapped Column Name**: `date`
   - **Data Type**: Select `Date`
   - **Date Validation**: Select `True` (should be enabled)
   - **Date Format**: Enter `%d/%m/%Y` (should be enabled)
   - **Composite Key**: `False`
   - **Allow Null**: `False`
   - **Unique**: `False`

**Expected**: 
- Date Validation and Date Format fields are enabled
- If Date Format is empty, validation error appears

#### Test Case 7: Composite Key Column
1. Click **"+ Add Row"**
2. Fill in:
   - **Column Name**: `Statezip`
   - **Mapped Column Name**: `statezip`
   - **Data Type**: `String`
   - **Composite Key**: Select `True`
   - **Composite Key Order**: Select `1` (should be enabled)
   - **Allow Null**: `False`
   - **Accept Special Character**: `False`
   - **Unique**: `False`

**Expected**:
- Composite Key Order field is enabled
- Can select order 1-5

#### Test Case 8: Special Character Column (String Type Only)
1. Click **"+ Add Row"**
2. Fill in:
   - **Column Name**: `Address`
   - **Mapped Column Name**: `address`
   - **Data Type**: `String` (must be String)
   - **Composite Key**: `False`
   - **Allow Null**: `True`
   - **Accept Special Character**: Select `True`
   - **Special Character**: Enter `!@#$%^&` (should be enabled)
   - **Unique**: `False`

**Expected**:
- Special Character field is enabled only when Accept Special Character = True AND Data Type = String
- If Special Character is empty when accepted, validation error appears

#### Test Case 9: Conditional Field Disable
Test that fields are properly disabled:

1. **Date fields**: 
   - Set Data Type to `String`, then try to use Date Validation/Format
   - **Expected**: Fields are disabled (grayed out)

2. **Composite Key Order**:
   - Set Composite Key to `False`, then try to select order
   - **Expected**: Field is disabled

3. **Special Character**:
   - Set Data Type to `Integer`, then try to set Accept Special Character
   - **Expected**: Field is disabled
   - Set Data Type to `String` and Accept Special Character to `False`
   - **Expected**: Special Character field is disabled

#### Test Case 10: Validation Errors
Test validation for mandatory fields:

1. Leave **Column Name** empty → **Expected**: Error "Column Name is required"
2. Leave **Mapped Column Name** empty → **Expected**: Error "Mapped Column Name is required"
3. Leave **Data Type** unselected → **Expected**: Error "Data Type is required"
4. Leave **Allow Null** unselected → **Expected**: Error "Allow Null is required"
5. Leave **Unique** unselected → **Expected**: Error "Unique is required"

#### Test Case 11: Duplicate Validation
1. Add two rows with same **Mapped Column Name**: `country`
2. **Expected**: Second row shows error "Mapped Column Name must be unique"

#### Test Case 12: Composite Key Order Uniqueness
1. Add two rows, both with Composite Key = `True`
2. Set both to Composite Key Order = `1`
3. **Expected**: Second row shows error "Composite Key Order must be unique"

#### Test Case 13: Delete Row
1. Add multiple rows
2. Click the 🗑️ icon on any row
3. **Expected**: Row is removed, other rows remain intact

---

### Step 4: Test Save Functionality

#### Test Case 14: Save with Validation
1. Fill in all required fields correctly
2. Add at least one column configuration
3. Click **"Save"** button
4. **Expected**: 
   - JSON file downloads automatically
   - Success notification appears (green)
   - File name: `{filename}_config.json`

#### Test Case 15: Save with Errors
1. Leave some required fields empty or enter invalid data
2. Click **"Save"** button
3. **Expected**: 
   - Error notification appears (red): "Please fix all validation errors before saving."
   - No file is downloaded
   - Error messages are displayed on invalid fields

#### Test Case 16: Save Draft
1. Fill in some fields (can be incomplete)
2. Click **"Save Draft"** button
3. **Expected**: 
   - JSON file downloads without validation
   - Success notification appears
   - File contains current state (even if incomplete)

#### Test Case 17: Cancel
1. Fill in some data
2. Click **"Cancel"** button
3. **Expected**: 
   - Confirmation dialog appears
   - If confirmed: All fields are cleared
   - Success notification: "Changes discarded."

---

### Step 5: Test JSON Output

#### Test Case 18: Verify JSON Structure
1. Fill in complete configuration:
   - Department: `Denver`
   - File Name: `HP_reg_class_1gb_with_missing.csv`
   - Project: `CC`
   - Index: `sanitytest2`
   - Separator: `-`
   - Add columns as per sample in documentation

2. Click **"Save"**
3. Open the downloaded JSON file
4. **Expected**: JSON matches the structure:
   ```json
   {
     "uuid": "generated-uuid",
     "createdby": "System",
     "createddate": "ISO timestamp",
     "fileConfiguration": [
       {
         "deptName": "Denver",
         "fileName": "HP_reg_class_1gb_with_missing.csv",
         "projectName": "CC",
         "indexname": "sanitytest2",
         "compositeKeySeparator": "-",
         "columnConfiguration": [...]
       }
     ]
   }
   ```

#### Test Case 19: Verify Nested Objects
Check that the JSON includes:
- `compositeKey` object with `compositekey` and `compositekeyOrder` (when enabled)
- `specialCharacter` object with `acceptspecialcharacter` and `specialCharacter` array
- `dateValidation` and `dateFormat` (for Date type)
- All boolean values are `true`/`false` (not `True`/`False`)

---

### Step 6: Test Edge Cases

#### Test Case 20: Empty State
1. Don't add any rows
2. Click **"Save"**
3. **Expected**: Error "Please add at least one column configuration."

#### Test Case 21: Multiple Rows
1. Add 5-10 rows with different configurations
2. Fill all correctly
3. Click **"Save"**
4. **Expected**: All rows are included in JSON

#### Test Case 22: Special Characters in Input
1. Test file names with special characters: `test_file-123.csv`
2. Test column names with spaces: `Column Name`
3. **Expected**: Handled correctly in JSON

---

## Quick Test Checklist

- [ ] Application starts without errors
- [ ] Panel 1 fields accept valid input
- [ ] Panel 1 shows validation errors for invalid input
- [ ] Tooltips appear on hover
- [ ] Can add multiple rows
- [ ] Can delete rows
- [ ] Date fields enable/disable correctly
- [ ] Composite Key Order enables/disables correctly
- [ ] Special Character field enables/disables correctly
- [ ] Validation errors appear for empty mandatory fields
- [ ] Duplicate mapped column names show error
- [ ] Duplicate composite key orders show error
- [ ] Save button validates and downloads JSON
- [ ] Save Draft downloads without validation
- [ ] Cancel clears all data
- [ ] JSON structure is correct
- [ ] All conditional fields work as expected

---

## Sample Test Data

Use this complete example to test:

**Basic File Info:**
- Department Name: `Denver`
- File Name: `HP_reg_class_1gb_with_missing.csv`
- Project Name: `CC`
- Target Index Name: `sanitytest2`
- Composite Key Separator: `-`

**Column 1:**
- Column Name: `Country`
- Mapped Column Name: `country`
- Data Type: `String`
- Composite Key: `False`
- Allow Null: `True`
- Accept Special Character: `False`
- Unique: `False`

**Column 2:**
- Column Name: `Statezip`
- Mapped Column Name: `statezip`
- Data Type: `String`
- Composite Key: `True`
- Composite Key Order: `1`
- Allow Null: `False`
- Accept Special Character: `False`
- Unique: `False`

**Column 3:**
- Column Name: `Date`
- Mapped Column Name: `date`
- Data Type: `Date`
- Date Validation: `True`
- Date Format: `%d/%m/%Y`
- Composite Key: `False`
- Allow Null: `False`
- Unique: `False`

---

## Troubleshooting

**Issue**: Application won't start
- **Solution**: Make sure `npm install` completed successfully

**Issue**: Validation not working
- **Solution**: Check browser console for errors

**Issue**: JSON not downloading
- **Solution**: Check browser download settings, allow downloads

**Issue**: Fields not enabling/disabling
- **Solution**: Make sure Data Type is selected first for conditional fields

