import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/constants';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { CheckCheckIcon, Loader2 } from 'lucide-react';
import { Span } from 'next/dist/trace';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

type Props = {};

const CodeBlock: React.FC<Props> = () => {
    const [input, setInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<{
        isProfanity?: boolean;
        score?: number;
        flaggedFor?: string;
    } | null>();
    const [error, setError] = useState<boolean>(false);

    const fetchData = async () => {
        setResult({});
        setError(false);
        setLoading(true);

        try {
            const response = await axios.post(API_URL, { message: input }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setResult(response.data);
        } catch (error) {
            console.error('Error:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const loadingProp = (
        <div className="flex items-center justify-center w-full">
            <Loader2 className="size-8 dap-4 animate-spin" />
            <span className="text-lg mx-2">Loading the Results ...</span>
        </div>
    );

    const resultProp = (
        <div className="flex items-center justify-center w-full">
            {result === null || result === undefined ? (
                <span className="text-sm text-slate-800 dark:text-slate-200">Results will be shown here.</span>
            ) : (
                result.isProfanity ? (
                    <span className="text-red-400 text-sm">
                        <ExclamationTriangleIcon className="inline size-5 gap-2" />
                        Profanity Detected <br />
                        <b>Flagged For:</b> {result.flaggedFor} {" | "}
                        <b>Score:</b> {result.score ? result.score : "Not Available"}
                    </span>
                ) : (
                    <span className="text-emerald-400 text-sm">
                        <CheckCheckIcon className="inline size-5 gap-2" />
                        No Profanity Detected <br />
                        <b>Score:</b> {result.score ? result.score : "Not Available"}
                    </span>
                )
            )}
        </div>
    );
    

    return (
        <Card>
            <CardHeader className="flex items-center flex-row justify-start min-w-full">
                <span className="text-xs bg-slate-900 text-white dark:bg-slate-200 px-3 py-1 rounded-md dark:text-black">POST</span>
                <p className="text-xl pb-3 px-2">|</p>
                <a className="text-sm pb-3 hover:text-blue-700 hover:dark:text-blue-400 hover:underline" href={API_URL}>{API_URL}</a>
            </CardHeader>
            <CardContent className="flex items-center flex-row justify-center">
                <Input
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter Your Text Here"
                    value={input}
                    className="p-3 w-96 placeholder-text-center placeholder-items-center placeholder-mb-1"
                />

                <Button disabled={loading} onClick={fetchData} className='mx-4'> {loading ? "Checking Profanity" : "Check for Profanity"} </Button>
            </CardContent>
            <CardFooter>
                <Card className="w-full p-4">
                    {loading ? loadingProp : resultProp}
                </Card>
                {/* {error && <p>Error occurred. Please try again.</p>}
                {result.isProfanity !== undefined && (
                    <p>
                        {result.isProfanity ? 'Text contains profanity' : 'Text is clean'}
                    </p>
                )} */}
            </CardFooter>
        </Card>
    );
};

export default CodeBlock;
