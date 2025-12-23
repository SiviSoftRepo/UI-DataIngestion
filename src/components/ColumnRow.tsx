import React from 'react';
import './ColumnRow.css';
import { ColumnConfiguration, DataType, BooleanOption } from '../types';

interface ColumnRowProps {
  index: number;
  column: ColumnConfiguration;
  errors: { [fieldName: string]: string };
  onUpdate: (index: number, field: string, value: any) => void;
  onDelete: (index: number) => void;
}

const ColumnRow: React.FC<ColumnRowProps> = ({
  index,
  column,
  errors,
  onUpdate,
  onDelete,
}) => {
  const dataTypes: DataType[] = ['String', 'Integer', 'Date', 'Boolean', 'Keyword'];
  const booleanOptions: BooleanOption[] = ['True', 'False'];
  const compositeKeyOrders = [1, 2, 3, 4, 5];

  const handleChange = (field: string, value: any) => {
    onUpdate(index, field, value);
  };

  const isDateType = column.dataType === 'Date';
  const isCompositeKey = column.compositeKey?.compositekey === true;
  const acceptsSpecialChar = column.specialCharacter?.acceptspecialcharacter === true;
  const isStringType = column.dataType === 'String';

  return (
    <div className={`column-row ${Object.keys(errors).length > 0 ? 'has-errors' : ''}`}>
      <div className="row-cell">
        <input
          type="text"
          value={column.columnName || ''}
          onChange={(e) => handleChange('columnName', e.target.value)}
          className={errors.columnName ? 'error' : ''}
          placeholder="Column name"
        />
        {errors.columnName && (
          <span className="field-error">{errors.columnName}</span>
        )}
      </div>

      <div className="row-cell">
        <input
          type="text"
          value={column.mappedColumnName || ''}
          onChange={(e) => handleChange('mappedColumnName', e.target.value)}
          className={errors.mappedColumnName ? 'error' : ''}
          placeholder="Mapped name"
        />
        {errors.mappedColumnName && (
          <span className="field-error">{errors.mappedColumnName}</span>
        )}
      </div>

      <div className="row-cell">
        <select
          value={column.dataType || ''}
          onChange={(e) => handleChange('dataType', e.target.value as DataType)}
          className={errors.dataType ? 'error' : ''}
        >
          <option value="">Select</option>
          {dataTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.dataType && (
          <span className="field-error">{errors.dataType}</span>
        )}
      </div>

      <div className="row-cell">
        <select
          value={column.compositeKey?.compositekey === true ? 'True' : column.compositeKey?.compositekey === false ? 'False' : ''}
          onChange={(e) => {
            const value = e.target.value === 'True';
            handleChange('compositeKey', {
              ...column.compositeKey,
              compositekey: value,
              ...(value ? {} : { compositekeyOrder: undefined }),
            });
          }}
          className={errors.compositeKey ? 'error' : ''}
        >
          <option value="">Select</option>
          {booleanOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.compositeKey && (
          <span className="field-error">{errors.compositeKey}</span>
        )}
      </div>

      <div className="row-cell">
        <select
          value={column.compositeKey?.compositekeyOrder || ''}
          onChange={(e) => {
            const order = e.target.value ? parseInt(e.target.value) : undefined;
            handleChange('compositeKey', {
              ...column.compositeKey,
              compositekey: true,
              compositekeyOrder: order,
            });
          }}
          disabled={!isCompositeKey}
          className={errors.compositeKeyOrder ? 'error' : ''}
        >
          <option value="">Select</option>
          {compositeKeyOrders.map((order) => (
            <option key={order} value={order}>
              {order}
            </option>
          ))}
        </select>
        {errors.compositeKeyOrder && (
          <span className="field-error">{errors.compositeKeyOrder}</span>
        )}
      </div>

      <div className="row-cell">
        <select
          value={column.dateValidation === true ? 'True' : column.dateValidation === false ? 'False' : ''}
          onChange={(e) => handleChange('dateValidation', e.target.value === 'True')}
          disabled={!isDateType}
          className={errors.dateValidation ? 'error' : ''}
        >
          <option value="">Select</option>
          {booleanOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.dateValidation && (
          <span className="field-error">{errors.dateValidation}</span>
        )}
      </div>

      <div className="row-cell">
        <input
          type="text"
          value={column.dateFormat || ''}
          onChange={(e) => handleChange('dateFormat', e.target.value)}
          disabled={!isDateType}
          placeholder="%d/%m/%Y"
          className={errors.dateFormat ? 'error' : ''}
        />
        {errors.dateFormat && (
          <span className="field-error">{errors.dateFormat}</span>
        )}
      </div>

      <div className="row-cell">
        <select
          value={column.allowNull === true ? 'True' : column.allowNull === false ? 'False' : ''}
          onChange={(e) => handleChange('allowNull', e.target.value === 'True')}
          className={errors.allowNull ? 'error' : ''}
        >
          <option value="">Select</option>
          {booleanOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.allowNull && (
          <span className="field-error">{errors.allowNull}</span>
        )}
      </div>

      <div className="row-cell">
        <select
          value={column.specialCharacter?.acceptspecialcharacter === true ? 'True' : column.specialCharacter?.acceptspecialcharacter === false ? 'False' : ''}
          onChange={(e) => {
            const value = e.target.value === 'True';
            handleChange('specialCharacter', {
              ...column.specialCharacter,
              acceptspecialcharacter: value,
              ...(value ? {} : { specialCharacter: [] }),
            });
          }}
          disabled={!isStringType}
          className={errors.acceptspecialcharacter ? 'error' : ''}
        >
          <option value="">Select</option>
          {booleanOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.acceptspecialcharacter && (
          <span className="field-error">{errors.acceptspecialcharacter}</span>
        )}
      </div>

      <div className="row-cell">
        <input
          type="text"
          value={
            column.specialCharacter && Array.isArray(column.specialCharacter.specialCharacter)
              ? column.specialCharacter.specialCharacter.join('')
              : (column.specialCharacter?.specialCharacter || '')
          }
          onChange={(e) => {
            const chars = e.target.value.split('');
            handleChange('specialCharacter', {
              ...column.specialCharacter,
              acceptspecialcharacter: true,
              specialCharacter: chars,
            });
          }}
          disabled={!acceptsSpecialChar || !isStringType}
          placeholder="!@#$%^&"
          className={errors.specialCharacter ? 'error' : ''}
        />
        {errors.specialCharacter && (
          <span className="field-error">{errors.specialCharacter}</span>
        )}
      </div>

      <div className="row-cell">
        <select
          value={column.unique === true ? 'True' : column.unique === false ? 'False' : ''}
          onChange={(e) => handleChange('unique', e.target.value === 'True')}
          className={errors.unique ? 'error' : ''}
        >
          <option value="">Select</option>
          {booleanOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.unique && (
          <span className="field-error">{errors.unique}</span>
        )}
      </div>

      <div className="row-cell actions-cell">
        <button
          className="delete-button"
          onClick={() => onDelete(index)}
          title="Delete row"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default ColumnRow;

