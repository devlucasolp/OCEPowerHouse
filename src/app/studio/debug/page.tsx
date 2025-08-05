'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [envVars, setEnvVars] = useState({
    projectId: 'loading...',
    dataset: 'loading...',
    apiVersion: 'loading...',
    hasToken: false,
  });

  useEffect(() => {
    setEnvVars({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'undefined',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'undefined',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || 'undefined',
      hasToken: false, // Client-side can't access SANITY_TOKEN
    });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Debug Sanity Variables</h1>
      <pre>{JSON.stringify(envVars, null, 2)}</pre>

      <h2>❗ Se algum valor está undefined:</h2>
      <ol>
        <li>Verifique o arquivo .env.local</li>
        <li>Reinicie o servidor (npm run dev)</li>
        <li>Certifique-se que não há espaços ao redor do =</li>
      </ol>

      <h2>ℹ️ Sobre o hasToken:</h2>
      <p>O token não aparece aqui por segurança (client-side). Verifique se está no .env.local:</p>
      <code>SANITY_TOKEN=seu_token_aqui</code>

      <h2>✅ Valores esperados:</h2>
      <ul>
        <li>
          <strong>projectId:</strong> string como &quot;1sbzjovr&quot; ✅
        </li>
        <li>
          <strong>dataset:</strong> &quot;production&quot; ✅
        </li>
        <li>
          <strong>apiVersion:</strong> &quot;2025-07-17&quot;{' '}
          {envVars.apiVersion === '2025-07-17' ? '✅' : '❌'}
        </li>
      </ul>
    </div>
  );
}
