import { getEmbeddings } from "./embeddings";
import { getPineconeClient } from "./pinecone";
import { converToAscii } from "./utils";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const pinecone = await getPineconeClient();
    const index = pinecone.Index("chatpdf");
    const namespace = converToAscii(fileKey);
    const queryResult = await index.query({
      queryRequest: {
        topK: 5,
        vector: embeddings,
        includeMetadata: true,
      },
    });
    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);

    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  const qualifyngDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyngDocs.map((match) => (match.metadata as Metadata).text);
  return docs.join(`\n`).substring(0, 3000);
}
