import React from "react";
import Dropzone from "react-dropzone";
import { Button, Textarea } from "@mui/joy";

type FileFieldProps = {
    label: string;
    file: File | null;
    setFile: (file: File) => void;
    fileText: string;
    setFileText: (text: string) => void;
};

export const FileField = ({ label, file, setFile, fileText, setFileText }: FileFieldProps) => {
    return (
        <div className="flex-grow">
            <div className="flex justify-between py-2 items-center">
                <h2>{label}</h2>
                <Button component="label">
                    Upload File
                    <input type="file" hidden onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            setFile(file);
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                setFileText(e.target?.result as string);
                            }
                            reader.readAsText(file);
                        }
                    }} />
                </Button>
            </div>
            <Dropzone 
                accept={{
                    "text/plain": [".txt", ".csv"],
                }} 
                noClick 
                maxFiles={1} 
                onDrop={(acceptedFiles) => {
                    const file = acceptedFiles[0];
                    setFile(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setFileText(e.target?.result as string);
                    }
                    reader.readAsText(file);
                }}>
                {({ getRootProps, getInputProps, isDragActive }) => (
                    <section>
                        <div {...getRootProps()}>
                            <input hidden {...getInputProps()} />
                            <Textarea placeholder={isDragActive ? "Drop it here!" : "Type something or drop a file"} minRows={10} value={fileText} onChange={
                                (e) => {
                                    setFileText(e.target.value);
                                }
                            } />
                        </div>
                    </section>
                )}
            </Dropzone>
        </div>
    );
};