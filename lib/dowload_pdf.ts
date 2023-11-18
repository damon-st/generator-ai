import axios from "axios";
import { createWriteStream, mkdirSync, existsSync } from "fs";
import path from "path";

export const dowloadPDF = async (
  file_key: string
): Promise<string | undefined> => {
  try {
    const response = await axios({
      method: "GET",
      url: `https://utfs.io/f/${file_key}`,
      responseType: "stream",
    });

    const file_name = path.join(__dirname, "tmp", `pdf${Date.now()}.pdf`);
    // Crear la carpeta "tmp" si no existe
    const tmpFolderPath = path.join(__dirname, "tmp");
    if (!existsSync(tmpFolderPath)) {
      mkdirSync(tmpFolderPath);
    }
    const writer = createWriteStream(file_name);
    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
    return file_name;
  } catch (error) {
    console.log("[ERROR_DOWLOAD_PDF]", error);

    return undefined;
  }
};
