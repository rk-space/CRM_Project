const ERPTable = ({ columns, data }) => {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <table border="1" width="100%" cellPadding="8">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ERPTable;
