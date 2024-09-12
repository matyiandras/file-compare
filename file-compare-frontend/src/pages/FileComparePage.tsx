import React, { useEffect, useState } from "react";
import { Button } from '@mui/joy';
import { diffLines} from 'diff';
import { formatLines } from 'unidiff';
import { parseDiff } from 'react-diff-view';
import { FileField } from "../components/FileField";
import { DiffViewer } from "../components/DiffViewer";


const EMPTY_HUNKS = [];
export const FileComparePage = () => {

    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);

    const [file1Text, setFile1Text] = useState<string>("");
    const [file2Text, setFile2Text] = useState<string>("");

    const [diffText, setDiffText] = useState<string>(""); // This will be the output of the diff command
    const diff = parseDiff(diffText, { nearbySequences: 'zip' });

    useEffect(() => {
        const dText = formatLines(diffLines(file1Text, file2Text), { context: Infinity });
        setDiffText(dText);
    }, [file1Text, file2Text]);

    return (
        <div>
            <h1 className="text-center pt-4 text-xl font-bold text-blue-600">File compare</h1>
            <h1 className="text-center text-sm">by Mátyás Dávid András</h1>
            <div className="flex flex-col md:flex-row p-8 w-full justify-center gap-8">
                <FileField label={"File 1"} file={file1} setFile={setFile1} fileText={file1Text} setFileText={setFile1Text} />
                <FileField label={"File 2"} file={file2} setFile={setFile2} fileText={file2Text} setFileText={setFile2Text} />
            </div>
            <div className="mx-8 ">
                <DiffViewer diff={diff} />
                {file1Text.length === 0 && file2Text.length === 0 && <div className="p-4 text-center text-gray-500">No files to compare</div>}
                {diff[0].hunks.length === 0 && file1Text.length > 0 && file2Text.length > 0 && <div className="p-4 text-center text-gray-500">No differences found</div>}
            </div>
        </div>
    );
}