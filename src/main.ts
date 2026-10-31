import { db } from "./db.ts";

const rows = db.prepare(`SELECT COUNT(*) as count FROM jvn`).get();
console.log(`登録件数: ${rows.count}件`);