import { db } from "./db.ts";
import { XMLParser } from "fast-xml-parser"

const url = "https://jvn.jp/rss/jvn.rdf";
const parser = new XMLParser({ ignoreAttributes: false});
async function getRssData(){
    try{
        const res = await fetch(url);
        if(!res.ok){
            throw new Error(`$サーバーエラー：${res.status}`);
        }
        return await res.text();
    }catch(e){
        return e.message;
    }
}

const outputObject = parser.parse(await getRssData());
console.log(outputObject["rdf:RDF"]["item"].length); 
