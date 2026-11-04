import { XMLParser } from "fast-xml-parser"
import { getAll, regData } from "./controller.ts";
import type { JvnItem,JvnRow } from './types.ts';
// import { db } from './db.ts';

const url = "https://jvn.jp/rss/jvn.rdf";
const parser = new XMLParser({ ignoreAttributes: false});
async function getRssData(){
    const res = await fetch(url);
    if(!res.ok){
        throw new Error(`サーバーエラー：${res.status}`);
    }
    return await res.text();
}

function checkNewInfo(dataList: JvnItem[], idList: JvnRow[]): JvnItem[]{
    return dataList.filter((item: JvnItem)=>{
        return !idList.some((row)=>{ return row.ID === item.id })
    });
}

async function notifyContent(items: JvnItem[]):Promise<void>{
    if(items.length === 0) return;
    const message = items.map((item)=>{ return `${item.title}: ${item.url}`}).join('\n');
    
    const webhookUrl = process.env.WEBHOOK_URL;
    if(!webhookUrl) throw new Error("WEBHOOK_URLが.envに設定されていません");
    const res = await fetch(webhookUrl,{
                    method: "POST",
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({content: message})
                });
    if(!res.ok){
        throw new Error(`サーバーエラー：${res.status}`);
    }
}

try{
    // db.prepare('DELETE FROM jvn WHERE ID = ?').run('JVN#23328936');
    const data = getAll();
    const outputObject = parser.parse(await getRssData());
    const items: JvnItem[] = outputObject["rdf:RDF"]["item"]
                                .map((item: any)=>{
                                    return {
                                        id: item["dc:identifier"],
                                        title: item["title"],
                                        url: item["link"],
                                        issued: item["dcterms:issued"]
                                    }
                                });
    const newItems = checkNewInfo(items,data);
    const x: number = 123;
    if(data.length === 0){
        const count = regData(newItems);
        console.log(`登録件数: ${count}`);
    }else{
        await notifyContent(newItems);
        const count = regData(newItems);
        console.log(`新規件数: ${count}`);    
    }
}catch(e){
    console.error("失敗しました:", e);
    process.exitCode = 1;
}