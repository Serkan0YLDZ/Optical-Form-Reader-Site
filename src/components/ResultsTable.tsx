interface Result {
  id: number;
  area: string;
  value: string;
}

interface ResultsTableProps {
  results: Result[];
}

export default function ResultsTable({ results }: ResultsTableProps) {
  return (
    <div className="w-full h-full bg-slate-800 rounded-lg p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-200">Sonuçlar</h2>
      </div>
      
      {results.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          Henüz sonuç bulunmamaktadır
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-slate-700">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Alan</th>
                <th className="py-3 px-4">Değer</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr 
                  key={result.id} 
                  className="border-b border-slate-700 hover:bg-slate-700"
                >
                  <td className="py-2 px-4">{result.id}</td>
                  <td className="py-2 px-4">{result.area}</td>
                  <td className="py-2 px-4">{result.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
