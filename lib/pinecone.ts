import {
  PineconeClient,
  Vector,
  utils as PineconeUtils,
} from "@pinecone-database/pinecone";
import { dowloadPDF } from "./dowload_pdf";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { converToAscii } from "./utils";

let pinecone: PineconeClient | null = null;

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new PineconeClient();
    await pinecone.init({
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENVIRONMENT!,
    });
  }
  return pinecone;
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadIntoPinecone(file_key: string) {
  //1. obtain the pdg -> dowload and reaf from pdf
  console.log("dowlonding into file system");

  const file_name = await dowloadPDF(file_key);
  if (!file_name) {
    throw new Error("could not dowload pdf");
  }
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  //2. split and segment the pdf
  const documents = await Promise.all(
    pages.map((page) => prepareDocument(page))
  );

  //3. vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  //4. upload to pinecone

  const client = await getPineconeClient();
  const pineconeIndex = client.Index("chatpdf");

  const namespace = converToAscii(file_key);
  console.log("inserting vecores into pinecone:", namespace);

  await PineconeUtils.chunkedUpsert(pineconeIndex, vectors, "", 10);
  return documents[0];
}

async function embedDocument(doc: Document) {
  try {
    const emeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);
    return {
      id: hash,
      values: emeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as Vector;
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}

function truncateStringByBytes(str: string, bytes: number) {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
}

async function prepareDocument(page: PDFPage) {
  let { metadata, pageContent } = page;

  pageContent = pageContent.replace(/\n/g, "");
  //split the docs
  const splleter = new RecursiveCharacterTextSplitter();
  const docs = splleter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}
