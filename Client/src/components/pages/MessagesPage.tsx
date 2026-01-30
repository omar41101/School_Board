import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useCreateMessageMutation, useGetMessagesInfiniteQuery } from '../../services/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Modal } from '../shared/Modal';
import { 
  Plus, 
  Search,
  Send,
  Inbox,
  Mail,
  Loader2,
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { cn } from '../../lib/utils';
import type { Message } from '../../types';

export function MessagesPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [createMessage, { isLoading: isSending }] = useCreateMessageMutation();
  const [compose, setCompose] = useState<{ recipientId: string; subject: string; content: string }>({
    recipientId: '',
    subject: '',
    content: '',
  });

  const {
    data,
    isFetching,
    isLoading,
  } = useGetMessagesInfiniteQuery({
    inbox: activeTab === 'inbox',
    sent: activeTab === 'sent',
    page,
    limit,
  });

  const messages: Message[] = data?.data?.messages ?? [];
  const totalPages = data?.totalPages ?? 1;
  const hasNextPage = page < totalPages;
  const isFetchingNextPage = isFetching && page > 1;

  useEffect(() => {
    if (scrollRef.current && hasNextPage && !isFetchingNextPage) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((p) => p + 1);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(scrollRef.current);
      return () => observer.disconnect();
    }
  }, [hasNextPage, isFetchingNextPage]);

  // Reset paging when switching inbox/sent
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const filteredMessages = messages.filter(msg => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      msg.subject.toLowerCase().includes(search) ||
      msg.content.toLowerCase().includes(search) ||
      (msg.sender && `${msg.sender.firstName} ${msg.sender.lastName}`.toLowerCase().includes(search)) ||
      (msg.recipient && `${msg.recipient.firstName} ${msg.recipient.lastName}`.toLowerCase().includes(search))
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#3E92CC]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your communications
          </p>
        </div>
        <Button onClick={() => setIsComposeOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Compose
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'inbox' | 'sent')}>
            <div className="border-b">
              <div className="flex items-center justify-between p-4">
                <TabsList>
                  <TabsTrigger value="inbox" className="flex items-center space-x-2">
                    <Inbox className="h-4 w-4" />
                    <span>Inbox</span>
                    {activeTab === 'inbox' && (
                      <Badge variant="secondary">
                        {filteredMessages.filter(m => !m.isRead).length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="sent" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Sent</span>
                  </TabsTrigger>
                </TabsList>

                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <TabsContent value={activeTab} className="m-0">
              <ScrollArea className="h-[600px]">
                <div className="divide-y">
                  {filteredMessages.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No messages found
                    </div>
                  ) : (
                    filteredMessages.map((message) => {
                      const otherUser = activeTab === 'inbox' ? message.sender : message.recipient;
                      return (
                        <div
                          key={message.id}
                          className={cn(
                            "p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                            !message.isRead && activeTab === 'inbox' && "bg-blue-50 dark:bg-blue-900/20"
                          )}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={otherUser?.avatar} />
                              <AvatarFallback>
                                {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium truncate">
                                  {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown'}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {new Date(message.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm font-semibold mt-1 truncate">{message.subject}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {message.content}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                {message.priority === 'high' && (
                                  <Badge variant="destructive" className="text-xs">High Priority</Badge>
                                )}
                                {message.category && (
                                  <Badge variant="outline" className="text-xs">{message.category}</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {hasNextPage && (
                    <div ref={scrollRef} className="p-4 text-center">
                      {isFetchingNextPage && (
                        <Loader2 className="h-6 w-6 animate-spin text-[#3E92CC] mx-auto" />
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedMessage && (
        <Modal
          open={!!selectedMessage}
          onOpenChange={() => setSelectedMessage(null)}
          title={selectedMessage.subject}
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4 pb-4 border-b">
              <Avatar>
                <AvatarImage src={(activeTab === 'inbox' ? selectedMessage.sender : selectedMessage.recipient)?.avatar} />
                <AvatarFallback>
                  {(activeTab === 'inbox' ? selectedMessage.sender : selectedMessage.recipient)?.firstName?.[0]}
                  {(activeTab === 'inbox' ? selectedMessage.sender : selectedMessage.recipient)?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {activeTab === 'inbox' 
                    ? `${selectedMessage.sender?.firstName} ${selectedMessage.sender?.lastName}`
                    : `${selectedMessage.recipient?.firstName} ${selectedMessage.recipient?.lastName}`}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              {selectedMessage.content}
            </div>
          </div>
        </Modal>
      )}

      <Modal
        open={isComposeOpen}
        onOpenChange={setIsComposeOpen}
        title="Compose Message"
        size="lg"
        footer={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsComposeOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={isSending || !compose.recipientId || !compose.subject || !compose.content}
              onClick={async () => {
                try {
                  await createMessage({
                    recipientId: Number(compose.recipientId),
                    subject: compose.subject,
                    content: compose.content,
                  }).unwrap();
                  toast.success('Message sent successfully');
                  setCompose({ recipientId: '', subject: '', content: '' });
                  setIsComposeOpen(false);
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : 'Failed to send message');
                }
              }}
            >
              {isSending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Recipient user ID</Label>
            <Input
              type="number"
              value={compose.recipientId}
              onChange={(e) => setCompose((p) => ({ ...p, recipientId: e.target.value }))}
              placeholder="e.g. 1"
            />
            <p className="text-xs text-muted-foreground">
              Use the recipient’s User ID (from Admin → Users).
            </p>
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              value={compose.subject}
              onChange={(e) => setCompose((p) => ({ ...p, subject: e.target.value }))}
              placeholder="Subject..."
            />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <textarea
              className="min-h-32 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
              value={compose.content}
              onChange={(e) => setCompose((p) => ({ ...p, content: e.target.value }))}
              placeholder="Write your message..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
