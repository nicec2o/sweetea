export default function DataTable({
  data = [],
  columns = [],
  onRowClick,
  className = '',
  emptyMessage = '데이터가 없습니다.',
  striped = true,
  hoverable = true
}) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.headerClassName || ''
                }`}
                style={column.headerStyle}
              >
                {column.header || column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`bg-white divide-y divide-gray-200 ${striped ? 'divide-gray-200' : ''}`}>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`
                ${hoverable ? 'hover:bg-gray-50' : ''}
                ${onRowClick ? 'cursor-pointer' : ''}
                ${striped && rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              `}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={column.key || colIndex}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                    column.cellClassName || ''
                  }`}
                  style={column.cellStyle}
                >
                  {column.render 
                    ? column.render(row[column.key], row, rowIndex)
                    : row[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
