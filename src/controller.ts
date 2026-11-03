import { db } from "./db.ts";
import type { JvnItem,JvnRow } from './types.ts';

const insertStmt =  db.prepare(
    `INSERT INTO jvn
    (ID,TITLE,URL,ISSUED)
    VALUES
    (?,?,?,?)
    ON CONFLICT (ID) DO NOTHING
    `);

const selectStmt = db.prepare(`
    SELECT ID FROM jvn
    `);

function getAll(){
  return selectStmt.all() as JvnRow[];
};

function regData(list: JvnItem[]){
    let count = 0;
    const insertMany = db.transaction((params:JvnItem[])=>{
            for(const param of params){
                const result = insertStmt.run(param.id,
                                              param.title,
                                              param.url,
                                              param.issued);
                count = count + result.changes;
            }
        }
    )

    insertMany(list);
    return count;
};

export { getAll, regData };