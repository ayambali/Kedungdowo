import { prisma } from "@/lib/prisma";
import KnowledgeClient from "./KnowledgeClient";

export const metadata = { title: "Pengetahuan AI | Admin Desa Kedungdowo" };

export default async function AdminChatbotKnowledgePage() {
  const data = await prisma.chatbotKnowledge.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-on-background mb-2">Pengetahuan AI (Chatbot)</h1>
      <p className="text-on-surface-variant text-sm mb-8">
        Kelola informasi dan instruksi yang akan dipelajari oleh Asisten AI Desa Kedungdowo. 
        Data di sini akan langsung digunakan oleh Chatbot untuk menjawab pertanyaan warga.
      </p>
      
      <KnowledgeClient initialData={data} />
    </div>
  );
}
