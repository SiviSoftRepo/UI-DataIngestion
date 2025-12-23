export type DataType = 'String' | 'Integer' | 'Date' | 'Boolean' | 'Keyword';
export type BooleanOption = 'True' | 'False';

export interface CompositeKey {
  compositekey: boolean;
  compositekeyOrder?: number;
}

export interface SpecialCharacter {
  acceptspecialcharacter: boolean;
  specialCharacter: string[];
}

export interface ColumnConfiguration {
  columnName: string;
  mappedColumnName: string;
  dataType: DataType;
  compositeKey?: CompositeKey;
  specialCharacter?: SpecialCharacter;
  allowNull: boolean;
  unique: boolean;
  dateValidation?: boolean;
  dateFormat?: string;
}

export interface FileConfiguration {
  deptName: string;
  fileName: string;
  projectName: string;
  indexname: string;
  compositeKeySeparator: string;
  columnConfiguration: ColumnConfiguration[];
}

export interface ConfigurationData {
  uuid?: string;
  createdby?: string;
  createddate?: string;
  fileConfiguration: FileConfiguration[];
}

export interface FormErrors {
  [key: string]: string;
}

export interface ColumnRowErrors {
  [rowIndex: number]: {
    [fieldName: string]: string;
  };
}

