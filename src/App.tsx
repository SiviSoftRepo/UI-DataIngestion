import React, { useState } from 'react';
import './App.css';
import BasicFileInfoPanel from './components/BasicFileInfoPanel';
import ColumnMappingPanel from './components/ColumnMappingPanel';
import { ColumnConfiguration, FormErrors, ColumnRowErrors } from './types';
import { validateAll } from './utils/validation';
import { generateJSON, downloadJSON } from './utils/jsonGenerator';

const App: React.FC = () => {
  const [basicFormData, setBasicFormData] = useState({
    deptName: '',
    fileName: '',
    projectName: '',
    indexname: '',
    compositeKeySeparator: '',
  });

  const [columns, setColumns] = useState<ColumnConfiguration[]>([]);
  const [basicErrors, setBasicErrors] = useState<FormErrors>({});
  const [columnErrors, setColumnErrors] = useState<ColumnRowErrors>({});
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleBasicFieldChange = (field: string, value: string) => {
    setBasicFormData({ ...basicFormData, [field]: value });
    // Clear error for this field when user starts typing
    if (basicErrors[field]) {
      const newErrors = { ...basicErrors };
      delete newErrors[field];
      setBasicErrors(newErrors);
    }
  };

  const handleAddRow = () => {
    const newColumn: ColumnConfiguration = {
      columnName: '',
      mappedColumnName: '',
      dataType: 'String' as const,
      allowNull: false,
      unique: false,
      compositeKey: {
        compositekey: false,
      },
      specialCharacter: {
        acceptspecialcharacter: false,
        specialCharacter: [],
      },
    };
    setColumns([...columns, newColumn]);
  };

  const handleDeleteRow = (index: number) => {
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);
    // Clear errors for deleted row
    const newErrors = { ...columnErrors };
    delete newErrors[index];
    // Reindex remaining errors
    const reindexedErrors: ColumnRowErrors = {};
    Object.keys(newErrors).forEach((key) => {
      const oldIndex = parseInt(key);
      if (oldIndex > index) {
        reindexedErrors[oldIndex - 1] = newErrors[oldIndex];
      } else {
        reindexedErrors[oldIndex] = newErrors[oldIndex];
      }
    });
    setColumnErrors(reindexedErrors);
  };

  const handleUpdateRow = (index: number, field: string, value: any) => {
    const newColumns = [...columns];
    const column = { ...newColumns[index] };

    // Handle nested fields
    if (field === 'compositeKey') {
      column.compositeKey = value;
    } else if (field === 'specialCharacter') {
      column.specialCharacter = value;
    } else {
      (column as any)[field] = value;
    }

    // Reset dependent fields when parent changes
    if (field === 'dataType') {
      if (value !== 'Date') {
        column.dateValidation = undefined;
        column.dateFormat = undefined;
      }
      if (value !== 'String') {
        column.specialCharacter = {
          acceptspecialcharacter: false,
          specialCharacter: [],
        };
      }
    }

    newColumns[index] = column;
    setColumns(newColumns);

    // Clear errors for this field
    if (columnErrors[index] && columnErrors[index][field]) {
      const newErrors = { ...columnErrors };
      if (newErrors[index]) {
        const rowErrors = { ...newErrors[index] };
        delete rowErrors[field];
        newErrors[index] = rowErrors;
        if (Object.keys(rowErrors).length === 0) {
          delete newErrors[index];
        }
      }
      setColumnErrors(newErrors);
    }
  };

  const handleSave = () => {
    const { basicErrors: newBasicErrors, columnErrors: newColumnErrors } = validateAll(
      basicFormData,
      columns
    );

    setBasicErrors(newBasicErrors);
    setColumnErrors(newColumnErrors);

    if (Object.keys(newBasicErrors).length > 0 || Object.keys(newColumnErrors).length > 0) {
      showNotification('error', 'Please fix all validation errors before saving.');
      return;
    }

    if (columns.length === 0) {
      showNotification('error', 'Please add at least one column configuration.');
      return;
    }

    try {
      const jsonData = generateJSON(basicFormData, columns);
      downloadJSON(jsonData, `${basicFormData.fileName.replace('.csv', '')}_config.json`);
      showNotification('success', 'Configuration saved successfully!');
    } catch (error) {
      showNotification('error', 'Failed to generate configuration. Please try again.');
      console.error('Error generating JSON:', error);
    }
  };

  const handleSaveDraft = () => {
    const jsonData = generateJSON(basicFormData, columns);
    downloadJSON(jsonData, `${basicFormData.fileName || 'draft'}_config.json`);
    showNotification('success', 'Draft saved successfully!');
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to discard all changes?')) {
      setBasicFormData({
        deptName: '',
        fileName: '',
        projectName: '',
        indexname: '',
        compositeKeySeparator: '',
      });
      setColumns([]);
      setBasicErrors({});
      setColumnErrors({});
      showNotification('success', 'Changes discarded.');
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>File Ingestion Configuration</h1>
          <p className="subtitle">Configure file ingestion metadata and column mapping rules</p>
        </header>

        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        <div className="panels-container">
          <BasicFileInfoPanel
            formData={basicFormData}
            errors={basicErrors}
            onChange={handleBasicFieldChange}
          />

          <ColumnMappingPanel
            columns={columns}
            errors={columnErrors}
            onAddRow={handleAddRow}
            onDeleteRow={handleDeleteRow}
            onUpdateRow={handleUpdateRow}
          />
        </div>

        <div className="action-buttons">
          <button className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn-secondary" onClick={handleSaveDraft}>
            Save Draft
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

