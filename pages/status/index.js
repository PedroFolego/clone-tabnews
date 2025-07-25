import useSWR from "swr";

async function fetchAPI(key) {
  const res = await fetch(key);

  const responseBody = await res.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status Page</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let uptadtedAtText = "Carregando...";
  if (!isLoading && data) {
    uptadtedAtText = new Date(data.updated_at).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
  }

  return <div>Última atualização: {uptadtedAtText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseStatusInformation = "Carregando...";
  if (!isLoading && data) {
    databaseStatusInformation = (
      <>
        <div>Versão: {data.dependencies.database.version}</div>
        <div>
          Conexões abertas: {data.dependencies.database.opened_connections}
        </div>
        <div>
          Conexões máximas: {data.dependencies.database.max_connections}
        </div>
      </>
    );
  }

  return (
    <>
      <h2>Banco de Dados</h2>
      <div>{databaseStatusInformation}</div>
    </>
  );
}
