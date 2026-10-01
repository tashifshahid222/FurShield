export const Table = ({ children, className = '', minWidth = 560, ariaLabel = 'Table' }) => (
  <div className="table-wrapper">
    <table className={`table ${className}`.trim()} style={{ minWidth }} role="table" aria-label={ariaLabel}>
      {children}
    </table>
  </div>
);

export const TableHead = ({ columns = [], className = '' }) => (
  <thead className={className}>
    <tr>
      {columns.map((c, i) =>
        typeof c === 'string' ? (
          <th key={i} scope="col">
            {c}
          </th>
        ) : (
          <th key={i} scope="col" className={c.className || ''}>
            {c.label}
          </th>
        )
      )}
    </tr>
  </thead>
);

export const TableRow = ({ children, onClick = null, className = '' }) => (
  <tr className={className} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
    {children}
  </tr>
);

export const TableCell = ({ children, primary = false, muted = false, className = '' }) => (
  <td className={`${primary ? 'cell-primary' : ''} ${muted ? 'cell-muted' : ''} ${className}`.trim()}>{children}</td>
);

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

export const TableToolbar = ({ children }) => <div className="table-toolbar">{children}</div>;

export default Table;