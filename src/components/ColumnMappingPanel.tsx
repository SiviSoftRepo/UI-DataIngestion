import React from 'react';
import ColumnRow from './ColumnRow';
import './ColumnMappingPanel.css';
import { ColumnConfiguration } from '../types';

interface ColumnMappingPanelProps {
  columns: ColumnConfiguration[];
  errors: { [rowIndex: number]: { [fieldName: string]: string } };
  onAddRow: () => void;
  onDeleteRow: (index: number) => void;
  onUpdateRow: (index: number, field: string, value: any) => void;
}

const ColumnMappingPanel: React.FC<ColumnMappingPanelProps> = ({
  columns,
  errors,
  onAddRow,
  onDeleteRow,
  onUpdateRow,
}) => {
  return (
    <div className="column-mapping-panel">
      <div className="panel-header">
        <h2 className="panel-title">Column Mapping Configuration</h2>
        <button className="add-row-button" onClick={onAddRow}>
          + Add Row
        </button>
      </div>

      {columns.length === 0 ? (
        <div className="empty-state">
          <p>No columns configured. Click "Add Row" to start.</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <div className="header-cell">Column Name</div>
            <div className="header-cell">Mapped Column Name</div>
            <div className="header-cell">Data Type</div>
            <div className="header-cell">Composite Key</div>
            <div className="header-cell">Composite Key Order</div>
            <div className="header-cell">Date Validation</div>
            <div className="header-cell">Date Format</div>
            <div className="header-cell">Allow Null</div>
            <div className="header-cell">Accept Special Character</div>
            <div className="header-cell">Special Character</div>
            <div className="header-cell">Unique</div>
            <div className="header-cell">Actions</div>
          </div>

          <div className="table-body">
            {columns.map((column, index) => (
              <ColumnRow
                key={index}
                index={index}
                column={column}
                errors={errors[index] || {}}
                onUpdate={onUpdateRow}
                onDelete={onDeleteRow}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnMappingPanel;

