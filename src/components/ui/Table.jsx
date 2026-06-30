const ACTION_KEYS = ['actions', 'action', 'a']

const actionButtonClasses = [
  '[&_button]:inline-flex',
  '[&_button]:h-9',
  '[&_button]:w-9',
  '[&_button]:items-center',
  '[&_button]:justify-center',
  '[&_button]:rounded-xl',
  '[&_button]:border',
  '[&_button]:border-transparent',
  '[&_button]:text-white',
  '[&_button]:shadow-sm',
  '[&_button]:transition-all',
  '[&_button:hover]:-translate-y-0.5',

  // أول زر غالبًا تعديل / عرض
  '[&_button:first-child]:bg-[#0B6F7A]',
  '[&_button:first-child]:hover:bg-[#075B78]',

  // تاني زر غالبًا حذف
  '[&_button:nth-child(2)]:bg-[#DC2626]',
  '[&_button:nth-child(2)]:hover:bg-red-700',

  // أي زر زيادة
  '[&_button:nth-child(n+3)]:bg-[#334155]',
  '[&_button:nth-child(n+3)]:hover:bg-slate-700',

  // Dark mode
  'dark:[&_button:first-child]:bg-cyan-500',
  'dark:[&_button:first-child]:text-slate-950',
  'dark:[&_button:first-child]:hover:bg-cyan-400',
  'dark:[&_button:nth-child(2)]:bg-red-500',
  'dark:[&_button:nth-child(2)]:hover:bg-red-400'
].join(' ')

export const Table = ({
  columns = [],
  data = [],
  empty = 'لا توجد بيانات لعرضها',
  rowKey = 'id'
}) => (
  <div className="overflow-hidden rounded-[1.5rem] border border-[#DCEAF3] bg-white/85 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-none">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead className="sticky top-0 z-10">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="whitespace-nowrap border-b border-[#DCEAF3] bg-[#F7FBFF] px-4 py-3 text-right text-xs font-black uppercase text-[#6B8293] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 text-center text-sm font-bold text-[#6B8293] dark:text-slate-400"
              >
                {empty || 'لا توجد بيانات لعرضها'}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row[rowKey] || rowIndex}
                className="border-b border-[#EAF2F6] transition-colors last:border-b-0 hover:bg-[#F7FBFF] dark:border-slate-800 dark:hover:bg-slate-800/55"
              >
                {columns.map((column) => {
                  const isActionColumn = ACTION_KEYS.includes(column.key)

                  return (
                    <td
                      key={column.key}
                      className={[
                        'px-4 py-3.5 align-middle text-sm font-bold text-[#41596B] dark:text-slate-300',
                        isActionColumn ? `w-[120px] ${actionButtonClasses}` : ''
                      ].join(' ')}
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)