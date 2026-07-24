const sessionId = 'test_' + Math.random().toString(36).substring(2, 10);

async function testChat(message) {
  console.log(`\nUser: "${message}"`);
  try {
    const response = await fetch('http://localhost:5000/api/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Session-Id': sessionId
      },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    console.log(`AI: "${data.reply}"`);
  } catch (error) {
    console.error('Error:', error);
  }
}

await testChat('Hello, who are you?');
await testChat('What stream should I choose after 10th?');
await testChat('How do I become a software engineer?');
