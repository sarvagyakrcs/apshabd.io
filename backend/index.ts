import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "hono/adapter";
import { Index } from "@upstash/vector";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

const app = new Hono().basePath("/gaali");

app.use(cors());

type Environment = {
    VECTOR_URL: string,
    VECTOR_TOKEN: string
};

const WHITELIST = ["swear", "gaali", "galoch", "abuse", "profanity", "apshabd"];
const PROFANITY_THRESHHOLD = 0.85

const semanticSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 25,
    separators: [" "],
    chunkOverlap: 12,
});

app.post("/", async (c) => {
    if (c.req.header("Content-Type") !== "application/json") {
        return c.json({
            error: "JSON Body Expected.",
        }, { status: 406 });
    }

    try {
        const { VECTOR_TOKEN, VECTOR_URL } = env<Environment>(c);

        const index = new Index({
            url: VECTOR_URL,
            token: VECTOR_TOKEN,
            cache: false, //for cloudflare workers
        });

        const body = await c.req.json();
        let { message } = body as { message: string };

        if (!message) {
            return c.json({
                error: "Message Argument is Required.",
            }, { status: 400 });
        }

        if (message.length > 500) {
            return c.json({
                error: "Message can only be at most 500 characters.",
            }, { status: 413 });
        }

        message = message
            .split(/\s/)
            .filter((word) => !WHITELIST.includes(word.toLowerCase()))
            .join(" ");

        const [ wordChunks, semanticChunks ] = await Promise.all([
            splitTextIntoWords(message),
            splitTextIntoSemantics(message)
        ]);

        const flaggedFor = new Set<{score: number, text: string}>();
        const vectorResponse = await Promise.all([
            ...wordChunks.map(async (word) => {
                const [ vector ] = await index.query({
                    topK: 1,
                    data: word,
                    includeMetadata: true
                })
                if(vector && vector.score > 0.94){
                    flaggedFor.add({
                        score: vector.score,
                        text: vector.metadata!.text as string
                    })
                }
                return { score : 0 }
            }),
            ...semanticChunks.map(async (semanticChunk) => {
                const [ vector ] = await index.query({
                    topK: 1,
                    data: semanticChunk,
                    includeMetadata: true
                })
                if(vector && vector.score > PROFANITY_THRESHHOLD){
                    flaggedFor.add({
                        score: vector.score,
                        text: vector.metadata!.text as string
                    })
                }
                return vector!
            })
        ])

        if(flaggedFor.size > 0){

            const sorted = Array.from(flaggedFor).sort((a, b) => a.score > b.score ? -1 : 1)[0];
            return c.json({
                isProfanity: true,
                score: sorted.score,
                flaggedFor: sorted.text,
            }, {status: 200});
        }
        else{
            const mostProfaneChunk = vectorResponse.sort((a, b) => a.score > b.score ? -1 : 1)[0];
            return c.json({
                isProfanity: false,
                score: mostProfaneChunk.score,
            }, {status: 200});
        }
    } catch (error) {
        console.error(error);
        return c.json({
            error: "Something Went Wrong"
        }, {status: 500});
    }
});

function splitTextIntoWords(text: string){
    return text.split(/\s/)
}

async function splitTextIntoSemantics(text: string){
    if(text.split(/\s/).length === 1) return [];
    const documents = await semanticSplitter.createDocuments([text])
    const chunks = documents.map((chunk) => {
        return chunk.pageContent
    })
    return chunks;
}

export default app;