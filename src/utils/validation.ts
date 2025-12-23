import { ColumnConfiguration, FormErrors, ColumnRowErrors } from '../types';

export const validateBasicFileInfo = (formData: {
  deptName: string;
  fileName: string;
  projectName: string;
  indexname: string;
  compositeKeySeparator: string;
}): FormErrors => {
  const errors: FormErrors = {};

  // Department Name validation
  if (!formData.deptName.trim()) {
    errors.deptName = 'Department Name is required';
  } else if (!/^[a-zA-Z\s]+$/.test(formData.deptName)) {
    errors.deptName = 'Department Name must contain only alphabets and spaces';
  }

  // File Name validation
  if (!formData.fileName.trim()) {
    errors.fileName = 'File Name is required';
  } else if (!/\.csv$/i.test(formData.fileName)) {
    errors.fileName = 'File Name must have .csv extension';
  }

  // Project Name validation
  if (!formData.projectName.trim()) {
    errors.projectName = 'Project Name is required';
  } else if (!/^[a-zA-Z0-9]+$/.test(formData.projectName)) {
    errors.projectName = 'Project Name must be alphanumeric';
  }

  // Target Index Name validation
  if (!formData.indexname.trim()) {
    errors.indexname = 'Target Index Name is required';
  } else if (!/^[a-z0-9_]+$/.test(formData.indexname)) {
    errors.indexname = 'Target Index Name must be lowercase with underscores only';
  }

  // Composite Key Separator validation
  if (!formData.compositeKeySeparator.trim()) {
    errors.compositeKeySeparator = 'Composite Key Separator is required';
  } else if (formData.compositeKeySeparator.length !== 1) {
    errors.compositeKeySeparator = 'Composite Key Separator must be a single character';
  } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.compositeKeySeparator)) {
    errors.compositeKeySeparator = 'Composite Key Separator must be a special character';
  }

  return errors;
};

export const validateColumnConfiguration = (
  columns: ColumnConfiguration[]
): ColumnRowErrors => {
  const errors: ColumnRowErrors = {};
  const mappedColumnNames: string[] = [];
  const compositeKeyOrders: number[] = [];

  columns.forEach((column, index) => {
    const rowErrors: { [fieldName: string]: string } = {};

    // Mandatory field validations
    if (!column.columnName?.trim()) {
      rowErrors.columnName = 'Column Name is required';
    }

    if (!column.mappedColumnName?.trim()) {
      rowErrors.mappedColumnName = 'Mapped Column Name is required';
    } else {
      // Check for duplicate mapped column names
      if (mappedColumnNames.includes(column.mappedColumnName.trim())) {
        rowErrors.mappedColumnName = 'Mapped Column Name must be unique';
      } else {
        mappedColumnNames.push(column.mappedColumnName.trim());
      }
    }

    if (!column.dataType) {
      rowErrors.dataType = 'Data Type is required';
    }

    if (column.allowNull === undefined || column.allowNull === null) {
      rowErrors.allowNull = 'Allow Null is required';
    }

    if (column.unique === undefined || column.unique === null) {
      rowErrors.unique = 'Unique is required';
    }

    // Composite Key validation
    if (column.compositeKey?.compositekey === true) {
      if (!column.compositeKey.compositekeyOrder) {
        rowErrors.compositeKeyOrder = 'Composite Key Order is required when Composite Key is True';
      } else {
        // Check for duplicate composite key orders
        if (compositeKeyOrders.includes(column.compositeKey.compositekeyOrder)) {
          rowErrors.compositeKeyOrder = 'Composite Key Order must be unique';
        } else {
          compositeKeyOrders.push(column.compositeKey.compositekeyOrder);
        }
      }
    }

    // Date validation
    if (column.dataType === 'Date') {
      if (column.dateValidation === undefined || column.dateValidation === null) {
        rowErrors.dateValidation = 'Date Validation is required for Date type';
      }
      if (!column.dateFormat?.trim()) {
        rowErrors.dateFormat = 'Date Format is required for Date type';
      }
    }

    // Special Character validation
    if (column.dataType === 'String' && column.specialCharacter?.acceptspecialcharacter === true) {
      if (!column.specialCharacter.specialCharacter || 
          (Array.isArray(column.specialCharacter.specialCharacter) && 
           column.specialCharacter.specialCharacter.length === 0)) {
        rowErrors.specialCharacter = 'Special Character is required when Accept Special Character is True';
      }
    }

    if (Object.keys(rowErrors).length > 0) {
      errors[index] = rowErrors;
    }
  });

  return errors;
};

export const validateAll = (
  formData: {
    deptName: string;
    fileName: string;
    projectName: string;
    indexname: string;
    compositeKeySeparator: string;
  },
  columns: ColumnConfiguration[]
): { basicErrors: FormErrors; columnErrors: ColumnRowErrors } => {
  const basicErrors = validateBasicFileInfo(formData);
  const columnErrors = validateColumnConfiguration(columns);

  return { basicErrors, columnErrors };
};

