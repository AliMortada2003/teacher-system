export const Table = ({ columns = [], data = [], empty = 'لا توجد بيانات لعرضها', rowKey = 'id' }) => (
  <div className="card overflow-hidden p-0">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead className="sticky top-0 z-10">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="table-head">{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-sm text-ink-500">
                {empty || 'لا توجد بيانات لعرضها'}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row[rowKey]} className="transition-colors hover:bg-ink-50">
                {columns.map((column) => (
                  <td key={column.key} className="table-cell">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)
