import React, { useState } from 'react';
import './BasicFileInfoPanel.css';

interface BasicFileInfoPanelProps {
  formData: {
    deptName: string;
    fileName: string;
    projectName: string;
    indexname: string;
    compositeKeySeparator: string;
  };
  errors: { [key: string]: string };
  onChange: (field: string, value: string) => void;
}

const BasicFileInfoPanel: React.FC<BasicFileInfoPanelProps> = ({
  formData,
  errors,
  onChange,
}) => {
  const [tooltips, setTooltips] = useState<{ [key: string]: boolean }>({});

  const handleChange = (field: string, value: string) => {
    onChange(field, value);
  };

  const showTooltip = (field: string) => {
    setTooltips({ ...tooltips, [field]: true });
  };

  const hideTooltip = (field: string) => {
    setTooltips({ ...tooltips, [field]: false });
  };

  const tooltipMessages: { [key: string]: string } = {
    deptName: 'Name of the department owning this file',
    fileName: 'Name of the uploaded file (must be .csv)',
    projectName: 'Project identifier',
    indexname: 'Elasticsearch target index (lowercase, underscores allowed)',
    compositeKeySeparator: 'Separator used for composite key (single special character only)',
  };

  return (
    <div className="basic-file-info-panel">
      <h2 className="panel-title">File Ingestion Details</h2>
      
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="deptName">
            Department Name <span className="required">*</span>
            <span
              className="tooltip-icon"
              onMouseEnter={() => showTooltip('deptName')}
              onMouseLeave={() => hideTooltip('deptName')}
            >
              ℹ️
            </span>
          </label>
          {tooltips.deptName && (
            <div className="tooltip">{tooltipMessages.deptName}</div>
          )}
          <input
            type="text"
            id="deptName"
            value={formData.deptName}
            onChange={(e) => handleChange('deptName', e.target.value)}
            className={errors.deptName ? 'error' : ''}
          />
          {errors.deptName && (
            <span className="error-message">{errors.deptName}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="fileName">
            File Name <span className="required">*</span>
            <span
              className="tooltip-icon"
              onMouseEnter={() => showTooltip('fileName')}
              onMouseLeave={() => hideTooltip('fileName')}
            >
              ℹ️
            </span>
          </label>
          {tooltips.fileName && (
            <div className="tooltip">{tooltipMessages.fileName}</div>
          )}
          <input
            type="text"
            id="fileName"
            value={formData.fileName}
            onChange={(e) => handleChange('fileName', e.target.value)}
            className={errors.fileName ? 'error' : ''}
            placeholder="example.csv"
          />
          {errors.fileName && (
            <span className="error-message">{errors.fileName}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="projectName">
            Project Name <span className="required">*</span>
            <span
              className="tooltip-icon"
              onMouseEnter={() => showTooltip('projectName')}
              onMouseLeave={() => hideTooltip('projectName')}
            >
              ℹ️
            </span>
          </label>
          {tooltips.projectName && (
            <div className="tooltip">{tooltipMessages.projectName}</div>
          )}
          <input
            type="text"
            id="projectName"
            value={formData.projectName}
            onChange={(e) => handleChange('projectName', e.target.value)}
            className={errors.projectName ? 'error' : ''}
          />
          {errors.projectName && (
            <span className="error-message">{errors.projectName}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="indexname">
            Target Index Name <span className="required">*</span>
            <span
              className="tooltip-icon"
              onMouseEnter={() => showTooltip('indexname')}
              onMouseLeave={() => hideTooltip('indexname')}
            >
              ℹ️
            </span>
          </label>
          {tooltips.indexname && (
            <div className="tooltip">{tooltipMessages.indexname}</div>
          )}
          <input
            type="text"
            id="indexname"
            value={formData.indexname}
            onChange={(e) => handleChange('indexname', e.target.value)}
            className={errors.indexname ? 'error' : ''}
          />
          {errors.indexname && (
            <span className="error-message">{errors.indexname}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="compositeKeySeparator">
            Composite Key Separator <span className="required">*</span>
            <span
              className="tooltip-icon"
              onMouseEnter={() => showTooltip('compositeKeySeparator')}
              onMouseLeave={() => hideTooltip('compositeKeySeparator')}
            >
              ℹ️
            </span>
          </label>
          {tooltips.compositeKeySeparator && (
            <div className="tooltip">{tooltipMessages.compositeKeySeparator}</div>
          )}
          <input
            type="text"
            id="compositeKeySeparator"
            value={formData.compositeKeySeparator}
            onChange={(e) => handleChange('compositeKeySeparator', e.target.value)}
            className={errors.compositeKeySeparator ? 'error' : ''}
            maxLength={1}
          />
          {errors.compositeKeySeparator && (
            <span className="error-message">{errors.compositeKeySeparator}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicFileInfoPanel;

