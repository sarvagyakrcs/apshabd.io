import fs from "fs"
import csv from "csv-parser"
import { Index } from "@upstash/vector"

interface Row {
    text: string
}

const index = new Index({
    url: "https://lorem30.com",
    token: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita labore id saepe cum, necessitatibus itaque.",
})

async function parseCSV(path: string): Promise<Row[]>{
    return new Promise((resolve, reject) => {
        const rows: Row[] = [];

        fs.createReadStream(path, "utf-8")
            .pipe(csv({separator:","}))
            .on("data", (chunk) => {
                rows.push(chunk)
            })
            .on("error", (error) => {
                reject(error)
            })
            .on("end", () => {
                resolve(rows);
            })
    })
}
console.log("Hello")
const BATCH_STEP = 30;
const seed = async () => {
    const data = await parseCSV("training_dataset.csv");
    for (let i = 0; i < data.length; i += BATCH_STEP) {
        const chunk = data.slice(i, i + 30);
        const formattedData = chunk.map((content, batchIndex) => {
            return {
                data: content.text,
                id: i+batchIndex,
                metadata: {text: content.text}
            }
        })
       await index.upsert(formattedData);
    }
}

seed();