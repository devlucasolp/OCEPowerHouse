'use client';

import { schema } from '../../../sanity/schemaTypes';

export default function SchemaDebugPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Debug dos Schemas Sanity</h1>

      <h2>📋 Schemas carregados:</h2>
      <ul>
        {schema.types.map((type) => (
          <li key={type.name}>
            <strong>{type.name}</strong> - {type.title || 'Sem título'}
            <br />
            <small>Tipo: {type.type}</small>
          </li>
        ))}
      </ul>

      <h2>📦 Schema de Produto:</h2>
      <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
        {JSON.stringify(
          schema.types.find((type) => type.name === 'product'),
          null,
          2,
        )}
      </pre>

      <h2>🏕️ Schema de Powercamp:</h2>
      <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
        {JSON.stringify(
          schema.types.find((type) => type.name === 'powercamp'),
          null,
          2,
        )}
      </pre>
    </div>
  );
}
