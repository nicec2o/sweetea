import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function DataGrid({
  rowData,
  columnDefs,
  onCellValueChanged,
  onRowClicked,
  onSelectionChanged,
  height = 600,
  pageSize = 20,
  customDefaultColDef = {},
  enableSelection = false,
  selectionMode = 'single',
  enablePagination = true,
  className = '',
  ...otherProps
}) {
  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
    ...customDefaultColDef
  }), [customDefaultColDef]);

  const rowSelection = useMemo(() => {
    if (!enableSelection) return undefined;
    return selectionMode;
  }, [enableSelection, selectionMode]);

  return (
    <div 
      className={`ag-theme-alpine ${className}`} 
      style={{ height, width: '100%' }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onCellValueChanged={onCellValueChanged}
        onRowClicked={onRowClicked}
        onSelectionChanged={onSelectionChanged}
        rowSelection={rowSelection}
        pagination={enablePagination}
        paginationPageSize={pageSize}
        animateRows={true}
        suppressRowClickSelection={!enableSelection}
        {...otherProps}
      />
    </div>
  );
}
