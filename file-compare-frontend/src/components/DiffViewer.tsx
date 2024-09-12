import { Button } from "@mui/joy";
import React from "react";
import { useEffect, useState } from "react";
import { parseDiff, Diff, Hunk } from 'react-diff-view';
import tokenize from "../utils/tokenize";
import 'react-diff-view/style/index.css';
import '../css/diff.css';
import { renderToPDF } from "../utils/pdfRender";

const EMPTY_HUNKS = [];

export const DiffViewer = ({ diff }) => {

    const [selectedChanges, setSelectedChanges] = useState<string[] | undefined>();
    const [selectedLine, setSelectedLine] = useState<number>(0);

    useEffect(() => {
        setSelectedChanges(getSelectedChanges(diff[0].hunks));
    }, [selectedLine]);

    function getSelectedChanges(hunks) {
        const c: any[] = [];
        if (hunks[0] && hunks[0].changes) {
            const changes = hunks[0].changes;
            changes.map(change => {
                if (change.lineNumber == selectedLine) {
                    if (change.type == 'insert') {
                        c.push("I" + change.lineNumber);
                    }
                    else if (change.type == 'delete') {
                        c.push("D" + change.lineNumber);
                    }
                }
            });
        }
        return c;
    }

    function nextChange(hunks) {
        const firstChange = hunks[0].changes.find(change => change.type != 'normal').lineNumber;
        if (selectedLine == 0) {
            setSelectedLine(firstChange);
            return;
        }
        if (selectedLine == hunks[0].changes[hunks[0].changes.length - 1].lineNumber) {
            return;
        }
        setSelectedLine(selectedLine + 1);
    }

    function prevChange(hunks) {
        const firstChange = hunks[0].changes.find(change => change.type != 'normal').lineNumber;
        if (selectedLine == firstChange) {
            return;
        }
        setSelectedLine(selectedLine - 1);
    }

    function renderFile({ oldRevision, newRevision, type, hunks }) {

        const tokens = tokenize(hunks);

        return (
            <div>
                <div className="flex justify-between items-center">
                    <Button onClick={() => renderToPDF(hunks)} className="m-4">Download PDF</Button>
                    <div className="flex gap-4">
                        <Button onClick={() => prevChange(hunks)} className="m-4">Previous</Button>
                        <Button onClick={() => nextChange(hunks)} className="m-4">Next</Button>
                    </div>
                </div>

                <div className="mt-2 border border-gray-300 rounded-md shadow-sm overflow-hidden ">
                    <Diff
                        key={oldRevision + '-' + newRevision}
                        viewType="split"
                        diffType={type}
                        hunks={hunks || EMPTY_HUNKS}
                        tokens={tokens}
                        renderToken={renderToken}
                        selectedChanges={selectedChanges}
                        className="">
                        {
                            hunks => hunks.map(hunk => {
                                return (
                                    <>
                                        <Hunk key={hunk.content} hunk={hunk} />
                                    </>
                                )
                            }
                            )}

                    </Diff>
                </div>
            </div>

        );
    }

    function renderToken(token, defaultRender, i) {
        switch (token.type) {
            case 'space':
                console.log(token);
                return (
                    <span key={i} className="space">
                        {token.children && token.children.map((token, i) => renderToken(token, defaultRender, i))}
                    </span>
                );
            default:
                return defaultRender(token, i);
        }
    };

    return (
        <>
            {diff.map(renderFile)}
        </>
    );
}