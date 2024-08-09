import database from 'infra/database.js';

async function status(req, res) {
  const updatedAt = new Date().toISOString()
  const dataBaseVersionResult = await database.query('SHOW server_version;')
  const databaseVersionValue = dataBaseVersionResult.rows[0].server_version

  const dataBaseMaxConnectionResult = await database.query('SHOW max_connections;')
  const databaseMaxConnectionValue = dataBaseMaxConnectionResult.rows[0].max_connections


  const databaseName = process.env.POSTGRES_DB
  const dataBaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName]
  }

  )
  const databaseOpenedConnectionsValue = dataBaseOpenedConnectionsResult.rows[0].count

  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionValue),
        opened_connections: databaseOpenedConnectionsValue,

      }
    }
  })
}

export default status