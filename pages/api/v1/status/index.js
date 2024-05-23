import database from '../../../../infra/database.js';

async function status(req, res) {
  const data = await database.query('SELECT 1 + 1;')
  console.log(data);
  res.status(200).json({ bararara: 'burrururururururu' })
}

export default status