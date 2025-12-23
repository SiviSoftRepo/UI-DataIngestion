import { ConfigurationData, FileConfiguration, ColumnConfiguration } from '../types';

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const generateJSON = (
  formData: {
    deptName: string;
    fileName: string;
    projectName: string;
    indexname: string;
    compositeKeySeparator: string;
  },
  columns: ColumnConfiguration[],
  createdBy?: string
): ConfigurationData => {
  const fileConfiguration: FileConfiguration = {
    deptName: formData.deptName.trim(),
    fileName: formData.fileName.trim(),
    projectName: formData.projectName.trim(),
    indexname: formData.indexname.trim(),
    compositeKeySeparator: formData.compositeKeySeparator.trim(),
    columnConfiguration: columns.map((col) => {
      const columnConfig: ColumnConfiguration = {
        columnName: col.columnName.trim(),
        mappedColumnName: col.mappedColumnName.trim(),
        dataType: col.dataType,
        allowNull: col.allowNull,
        unique: col.unique,
      };

      // Add compositeKey if it exists
      if (col.compositeKey !== undefined) {
        if (col.compositeKey.compositekey === true) {
          columnConfig.compositeKey = {
            compositekey: true,
            compositekeyOrder: col.compositeKey.compositekeyOrder,
          };
        } else {
          columnConfig.compositeKey = {
            compositekey: false,
          };
        }
      }

      // Add specialCharacter if it exists
      if (col.specialCharacter !== undefined) {
        columnConfig.specialCharacter = {
          acceptspecialcharacter: col.specialCharacter.acceptspecialcharacter,
          specialCharacter: Array.isArray(col.specialCharacter.specialCharacter)
            ? col.specialCharacter.specialCharacter
            : [],
        };
      }

      // Add dateValidation and dateFormat if Date type
      if (col.dataType === 'Date') {
        if (col.dateValidation !== undefined) {
          columnConfig.dateValidation = col.dateValidation;
        }
        if (col.dateFormat) {
          columnConfig.dateFormat = col.dateFormat.trim();
        }
      }

      return columnConfig;
    }),
  };

  const configData: ConfigurationData = {
    uuid: generateUUID(),
    createdby: createdBy || 'System',
    createddate: new Date().toISOString(),
    fileConfiguration: [fileConfiguration],
  };

  return configData;
};

export const downloadJSON = (jsonData: ConfigurationData, filename: string = 'configuration.json') => {
  const jsonString = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

