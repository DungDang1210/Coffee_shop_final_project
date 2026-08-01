import { useState } from "react";
import * as XLSX from "xlsx";

import {
    Upload,
    FileSpreadsheet
} from "lucide-react";

export default function ExcelImport({

    open,

    onClose,

    onImport

}){

    const [rows,setRows]=useState([]);

    const handleFile=(e)=>{

        const file=e.target.files[0];

        if(!file) return;

        const reader=new FileReader();

        reader.onload=(event)=>{

            const data=new Uint8Array(event.target.result);

            const workbook=XLSX.read(data,{

                type:"array"

            });

            const sheet=

                workbook.Sheets[
                    workbook.SheetNames[0]
                ];

            const json=

                XLSX.utils.sheet_to_json(sheet);

            setRows(json);

        };

        reader.readAsArrayBuffer(file);

    };

    if(!open) return null;

    return(

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl p-8 w-full max-w-5xl">

                <h2 className="text-3xl font-bold mb-6">

                    Import Products

                </h2>

                <label className="border-2 border-dashed rounded-2xl h-52 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">

                    <Upload size={50}/>

                    <p className="mt-3">

                        Click to choose Excel

                    </p>

                    <input

                        hidden

                        type="file"

                        accept=".xlsx,.xls"

                        onChange={handleFile}

                    />

                </label>

                {

                    rows.length>0 && (

                        <>

                            <div className="flex items-center gap-3 mt-8 mb-3">

                                <FileSpreadsheet/>

                                <h3 className="font-bold">

                                    Preview ({rows.length} products)

                                </h3>

                            </div>

                            <div className="max-h-72 overflow-auto border rounded-xl">

                                <table className="w-full">

                                    <thead className="bg-[#f7f3ee]">

                                        <tr>

                                            {

                                                Object.keys(rows[0]).map(key=>(

                                                    <th
                                                        key={key}
                                                        className="px-4 py-3 text-left"
                                                    >

                                                        {key}

                                                    </th>

                                                ))

                                            }

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {

                                            rows.slice(0,8).map((row,index)=>(

                                                <tr key={index} className="border-t">

                                                    {

                                                        Object.values(row).map((value,i)=>(

                                                            <td
                                                                key={i}
                                                                className="px-4 py-3"
                                                            >

                                                                {String(value)}

                                                            </td>

                                                        ))

                                                    }

                                                </tr>

                                            ))

                                        }

                                    </tbody>

                                </table>

                            </div>

                        </>

                    )

                }

                <div className="flex justify-end gap-4 mt-8">

                    <button

                        onClick={onClose}

                        className="border rounded-xl px-6 py-3"

                    >

                        Cancel

                    </button>

                    <button

                        onClick={()=>onImport(rows)}

                        className="bg-[#6b4f4f] text-white rounded-xl px-8 py-3"

                    >

                        Import

                    </button>

                </div>

            </div>

        </div>

    );

}