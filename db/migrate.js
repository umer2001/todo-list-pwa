const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");
require("dotenv").config();

/**
 * Splits a SQL script into individual statements while respecting
 * PostgreSQL comments (--, /* ... *\/), single-quoted strings, and
 * dollar-quoted blocks (e.g. DO $$ ... END $$;).
 */
function splitSqlStatements(sqlText) {
  const statements = [];
  let current = "";
  let inSingleQuote = false;
  let inLineComment = false;
  let inBlockComment = false;
  let dollarTag = null;

  for (let i = 0; i < sqlText.length; i++) {
    const ch = sqlText[i];
    const next = sqlText[i + 1];

    if (inLineComment) {
      if (ch === "\n") {
        inLineComment = false;
        current += ch;
      }
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (inSingleQuote) {
      current += ch;
      if (ch === "'") {
        if (next === "'") {
          current += next;
          i++;
        } else {
          inSingleQuote = false;
        }
      }
      continue;
    }

    if (dollarTag) {
      if (sqlText.startsWith(dollarTag, i)) {
        current += dollarTag;
        i += dollarTag.length - 1;
        dollarTag = null;
      } else {
        current += ch;
      }
      continue;
    }

    if (ch === "-" && next === "-") {
      inLineComment = true;
      i++;
      continue;
    }

    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i++;
      continue;
    }

    if (ch === "'") {
      inSingleQuote = true;
      current += ch;
      continue;
    }

    if (ch === "$") {
      const match = sqlText.slice(i).match(/^\$[A-Za-z_0-9]*\$/);
      if (match) {
        dollarTag = match[0];
        current += dollarTag;
        i += dollarTag.length - 1;
        continue;
      }
    }

    if (ch === ";") {
      const trimmed = current.trim();
      if (trimmed) {
        statements.push(trimmed);
      }
      current = "";
    } else {
      current += ch;
    }
  }

  const trailing = current.trim();
  if (trailing) {
    statements.push(trailing);
  }

  return statements;
}

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL is not set in environment.");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const schemaPath = path.join(__dirname, "schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf8");
  const statements = splitSqlStatements(schemaSql);

  console.log(`Running ${statements.length} migration statements against Neon...`);

  for (const statement of statements) {
    await sql.query(statement);
  }

  console.log("Database migration completed successfully.");
}

if (require.main === module) {
  migrate().catch((err) => {
    console.error("Database migration failed:", err);
    process.exit(1);
  });
}

module.exports = { splitSqlStatements, migrate };

