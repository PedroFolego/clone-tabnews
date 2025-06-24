import orchestrator from "tests/orchestrator.js"

beforeAll(async () => {
  await orchestrator.waitForAllServices()
})

test('Get to /api/v1/status should return 200', async () => {
  const res = await fetch('http://localhost:3000/api/v1/status')
  expect(res.status).toBe(200)

  const responseBody = await res.json()
  expect(responseBody.updated_at).toBeDefined()

  expect(responseBody.dependencies.database.version).toEqual('16.3')
  expect(responseBody.dependencies.database.max_connections).toEqual(100)
  expect(responseBody.dependencies.database.opened_connections).toEqual(1)

})

// test.only('Teste de SQL Injection', async () => {
// `SELECT count(*)::int FROM pg_stat_activity WHERE datname = 'local_db`
// await fetch('http://localhost:3000/api/v1/status?databaseName=local_db')

// `SELECT count(*)::int FROM pg_stat_activity WHERE datname = ''; SELECT pg_sleep(4); --';`
// await fetch("http://localhost:3000/api/v1/status?databaseName='; SELECT pg_sleep(4); --")
// })