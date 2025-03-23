// Chatbot functionality
class FinancialChatbot {
    constructor() {
        this.messages = [];
        this.initializeChatbot();
    }

    initializeChatbot() {
        const sendButton = document.getElementById('sendMessage');
        const chatInput = document.getElementById('chatbotInput');
        const chatMessages = document.getElementById('chatbotMessages');

        if (sendButton && chatInput && chatMessages) {
            sendButton.addEventListener('click', () => this.handleUserInput());
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleUserInput();
                }
            });

            // Initial greeting
            this.addMessage('bot', 'Hi! I\'m your financial assistant. How can I help you today?');
        }
    }

    handleUserInput() {
        const chatInput = document.getElementById('chatbotInput');
        const userMessage = chatInput.value.trim();

        if (userMessage) {
            this.addMessage('user', userMessage);
            chatInput.value = '';
            this.processUserMessage(userMessage);
        }
    }

    addMessage(sender, text) {
        const chatMessages = document.getElementById('chatbotMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = text;

        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        this.messages.push({ sender, text });
    }

    processUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = '';

        // Keywords and responses
        const responses = {
            budget: {
                keywords: ['budget', 'spending', 'expense', 'track money'],
                response: 'To create a budget, go to the Budget section. You can set spending limits, track expenses, and get insights on your spending patterns.'
            },
            savings: {
                keywords: ['save', 'savings', 'rd', 'fd', 'deposit', 'interest'],
                response: 'Check out our Savings section for RD and FD options. We offer competitive interest rates and flexible tenure options.'
            },
            rewards: {
                keywords: ['reward', 'points', 'redeem', 'badge', 'achievement'],
                response: 'Visit the Rewards section to see your earned points, badges, and available rewards for redemption.'
            },
            parental: {
                keywords: ['parent', 'control', 'limit', 'restriction'],
                response: 'Parental controls can be set up to manage spending limits, track transactions, and set category restrictions.'
            },
            help: {
                keywords: ['help', 'guide', 'how to', 'tutorial'],
                response: 'I can help you with budgeting, savings, rewards, or parental controls. What would you like to know more about?'
            }
        };

        // Find matching response
        for (const category in responses) {
            if (responses[category].keywords.some(keyword => lowerMessage.includes(keyword))) {
                response = responses[category].response;
                break;
            }
        }

        // Default response if no match found
        if (!response) {
            response = 'I\'m not sure about that. Would you like to know about budgeting, savings, rewards, or parental controls?';
        }

        // Add bot response with delay for natural feel
        setTimeout(() => {
            this.addMessage('bot', response);
        }, 500);
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FinancialChatbot();
});

// Add chatbot styles
const style = document.createElement('style');
style.textContent = `
    .chat-message {
        margin: 10px;
        padding: 10px;
        border-radius: 10px;
        max-width: 80%;
        animation: messageSlide 0.3s ease-out;
    }

    .user-message {
        margin-left: auto;
        background-color: var(--primary-color);
        color: white;
    }

    .bot-message {
        margin-right: auto;
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
    }

    .message-content {
        word-wrap: break-word;
    }

    @keyframes messageSlide {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    #chatbotMessages {
        height: 300px;
        overflow-y: auto;
        padding: 10px;
    }

    #chatbotMessages::-webkit-scrollbar {
        width: 5px;
    }

    #chatbotMessages::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    #chatbotMessages::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        border-radius: 5px;
    }
`;

document.head.appendChild(style);