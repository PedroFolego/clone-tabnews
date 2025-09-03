import database from "infra/database.js";
import { ValidationError } from "infra/errors.js";

async function create(userInputValues) {
  await validateUniqueField({ field: "email", value: userInputValues.email })
  await validateUniqueField({ field: "username", value: userInputValues.username })

  const newUser = await runInsertQuery(userInputValues)
  return newUser


  async function validateUniqueField({ field, value }) {
    const result = await database.query({
      text: `
        SELECT 
          ${field} 
        FROM 
          users 
        WHERE 
          LOWER(${field}) = LOWER($1)
        ;`,
      values: [value],
    });
    if (result.rowCount > 0) {
      throw new ValidationError({
        message: `O campo ${field} já está em uso.`,
        action: `Utilize outro ${field} para cadastro.`,
      })
    }
  }

  async function runInsertQuery(userInputValues) {
    const result = await database.query({
      text: `
        INSERT INTO 
          users (username, email, password) 
        VALUES 
          ($1, $2, $3)
        RETURNING 
          *
        ;`,
      values: [userInputValues.username, userInputValues.email, userInputValues.password],
    });
    return result.rows[0];
  }
}

const user = {
  create,
}

export default user;