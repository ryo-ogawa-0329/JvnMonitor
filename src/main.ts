import { db } from "./db.ts";
import { XMLParser } from "fast-xml-parser"

type JvnItem = {
    id: string,
    title: string,
    url: string,
    issued: string
};

const url = "https://jvn.jp/rss/jvn.rdf";
const parser = new XMLParser({ ignoreAttributes: false});
async function getRssData(){
    const res = await fetch(url);
    if(!res.ok){
        throw new Error(`サーバーエラー：${res.status}`);
    }
    return await res.text();
}

try{
    const outputObject = parser.parse(await getRssData());
    // console.log(outputObject["rdf:RDF"]["item"]);
    const items: JvnItem[] = outputObject["rdf:RDF"]["item"]
                    .map((item: any)=>{
                        return {
                            id: item["dc:identifier"],
                            title: item["title"],
                            url: item["link"],
                            issued: item["dcterms:issued"]
                        }
                    });
    console.log(items);
    console.log(items[0]["tilte"]);
}catch(e){
    console.error("失敗しました:", e);
    process.exitCode = 1;
}
