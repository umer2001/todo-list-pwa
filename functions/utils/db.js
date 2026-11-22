const { neon } = require("@neondatabase/serverless");
require("dotenv").config();

const VALID_PRIORITIES = new Set(["P1", "P2", "P3", "P4"]);

let cachedSql = null;
let cachedUrl = null;

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  if (!cachedSql || cachedUrl !== url) {
    cachedSql = neon(url);
    cachedUrl = url;
  }
  return cachedSql;
}

function normalizePriority(priority) {
  if (priority && VALID_PRIORITIES.has(priority)) {
    return priority;
  }
  return "P4";
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => String(item));
}

function normalizeDate(date) {
  if (date instanceof Date) {
    return date.toISOString();
  }
  if (typeof date === "string" && date.trim() !== "") {
    return date;
  }
  return new Date().toISOString();
}

function parseJsonBody(event) {
  try {
    const parsed = JSON.parse((event && event.body) || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, error: "Invalid JSON body" };
    }
    return { ok: true, data: parsed };
  } catch (err) {
    return { ok: false, error: "Invalid JSON body" };
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

module.exports = {
  getDb,
  VALID_PRIORITIES,
  normalizePriority,
  normalizeStringArray,
  normalizeDate,
  parseJsonBody,
  isNonEmptyString,
};

