import * as XLSX from "xlsx";

export async function parseImportFile(file) {

    let menu = [];

    if (file.name.endsWith(".json")) {

        const text = await file.text();

        menu = JSON.parse(text);

    }

    else if (

        file.name.endsWith(".xlsx") ||

        file.name.endsWith(".xls")

    ) {

        const data = await file.arrayBuffer();

        const workbook = XLSX.read(data);

        const sheet = workbook.Sheets[

            workbook.SheetNames[0]

        ];

        menu = XLSX.utils.sheet_to_json(sheet);

    }

    else {

        throw new Error("Unsupported file format.");

    }

    if (!Array.isArray(menu)) {

        throw new Error("Invalid file.");

    }

    return menu;

}