import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Avatar, Button, LoadingOverlay, Paper, ScrollArea, Text, TextInput, Container, Stack, Group } from '@mantine/core';
import { useForm } from '@mantine/form';

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
}

export default function Chat() {
  const queryClient = useQueryClient();
  const viewport = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Fetch chat history
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      const response = await axios.get('/api/messages');
      return response.data;
    },
    refetchInterval: 3000,
  });

  // Message form
  const form = useForm({
    initialValues: { prompt: '' },
  });

  // Send message mutation
  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (content: string) => {
      const response = await axios.post('/api/messages', { content });
      return response.data;
    },
    onMutate: async (content: string) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        isAI: false,
        timestamp: new Date(),
      };
      
      queryClient.setQueryData<Message[]>(['messages'], (old) => [
        ...(old || []),
        newMessage,
      ]);

      return { previousMessages: queryClient.getQueryData(['messages']) };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['messages'], context?.previousMessages);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      form.reset();
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && viewport.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight ?? 0,
        behavior: 'smooth',
      });
    }
  }, [messages, autoScroll]);

  return (
    <Container size="md" p="md">
      <Paper withBorder shadow="sm" radius="md" p="md" style={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
        <LoadingOverlay visible={isPending} />
        <ScrollArea style={{ flexGrow: 1 }} viewportRef={viewport}>
          <Stack p="md">
            {messages.map((message) => (
              <Group key={message.id} align="flex-end">
                {message.isAI && <Avatar color="blue" radius="xl">AI</Avatar>}
                <Paper p="sm" radius="md" style={{ maxWidth: '70%', backgroundColor: message.isAI ? '#dbeafe' : '#e5e7eb' }}>
                  <Text>{message.content}</Text>
                  <Text size="xs" color="dimmed" mt={4}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </Text>
                </Paper>
                {!message.isAI && <Avatar color="gray" radius="xl">You</Avatar>}
              </Group>
            ))}
          </Stack>
        </ScrollArea>

        <form onSubmit={form.onSubmit((values) => sendMessage(values.prompt))}>
          <Group mt="md" >
            <TextInput style={{ flex: 1 }} placeholder="Type your message..." {...form.getInputProps('prompt')} disabled={isPending} />
            <Button type="submit" loading={isPending}>
              Send
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
