import ChatBox from "@/components/ChatBox";

export default function PaperChatPage({ params }: { params: { id: string } }) {
  return (
    <main className="p-6">
      <h1 className="text-xl font-medium mb-4 max-w-2xl mx-auto">Chat with paper</h1>
      <ChatBox paperId={params.id} />
    </main>
  );
}