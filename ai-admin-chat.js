/**
 * BRAVESGADGET LLC - ADMIN AI ASSISTANT
 * AI-powered admin panel assistant for managing e-commerce operations
 */

class BravesGadgetAdminAI {
    constructor() {
        this.conversationHistory = [];
        this.adminContext = {
            recentActions: [],
            preferences: {},
            quickStats: {}
        };
        this.init();
    }

    init() {
        window.BRAVESGADGET_CONFIG?.logger.log('🤖 Admin AI Assistant initializing...');
        this.createChatWidget();
        this.setupEventListeners();
        this.loadConversationHistory();

        // Auto-greet after 2 seconds
        setTimeout(() => {
            this.sendWelcomeMessage();
        }, 2000);
    }

    createChatWidget() {
        const widgetHTML = `
            <div class="admin-ai-chat-widget">
                <!-- Chat Button -->
                <button class="admin-ai-chat-button" id="adminAiChatButton" aria-label="Open Admin AI Assistant">
                    <svg class="chat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="8" cy="12" r="1"></circle>
                        <circle cx="16" cy="12" r="1"></circle>
                    </svg>
                    <svg class="close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span class="chat-badge" id="adminChatBadge">1</span>
                </button>

                <!-- Chat Window -->
                <div class="admin-ai-chat-window" id="adminAiChatWindow">
                    <!-- Header -->
                    <div class="chat-header">
                        <div class="chat-header-info">
                            <div class="chat-avatar">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                    <path d="M2 17l10 5 10-5"></path>
                                    <path d="M2 12l10 5 10-5"></path>
                                </svg>
                            </div>
                            <div>
                                <div class="chat-title">Admin AI Assistant</div>
                                <div class="chat-status">
                                    <span class="status-dot"></span>
                                    Ready to help
                                </div>
                            </div>
                        </div>
                        <button class="chat-minimize" id="adminChatMinimize" aria-label="Minimize chat">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                    </div>

                    <!-- Messages -->
                    <div class="chat-messages" id="adminChatMessages"></div>

                    <!-- Quick Actions -->
                    <div class="chat-quick-actions">
                        <button class="quick-action-btn" onclick="window.adminAI.handleQuickAction('stats')">
                            📊 Quick Stats
                        </button>
                        <button class="quick-action-btn" onclick="window.adminAI.handleQuickAction('orders')">
                            🛒 Recent Orders
                        </button>
                        <button class="quick-action-btn" onclick="window.adminAI.handleQuickAction('products')">
                            📦 Low Stock
                        </button>
                        <button class="quick-action-btn" onclick="window.adminAI.handleQuickAction('help')">
                            ❓ Help
                        </button>
                    </div>

                    <!-- Input Area -->
                    <div class="chat-input-area">
                        <div class="chat-input-wrapper">
                            <input
                                type="text"
                                class="chat-input"
                                id="adminChatInput"
                                placeholder="Ask me to manage products, orders, analytics..."
                                autocomplete="off"
                            >
                            <button class="chat-send-btn" id="adminChatSendBtn" aria-label="Send message">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    setupEventListeners() {
        // Chat button toggle
        const chatButton = document.getElementById('adminAiChatButton');
        const chatWindow = document.getElementById('adminAiChatWindow');
        const chatBadge = document.getElementById('adminChatBadge');

        chatButton?.addEventListener('click', () => {
            const isActive = chatWindow.classList.contains('active');
            if (isActive) {
                chatWindow.classList.remove('active');
                chatButton.classList.remove('active');
            } else {
                chatWindow.classList.add('active');
                chatButton.classList.add('active');
                chatBadge.style.display = 'none';
                document.getElementById('adminChatInput')?.focus();
            }
        });

        // Minimize button
        document.getElementById('adminChatMinimize')?.addEventListener('click', () => {
            chatWindow.classList.remove('active');
            chatButton.classList.remove('active');
        });

        // Send button
        document.getElementById('adminChatSendBtn')?.addEventListener('click', () => {
            this.handleUserInput();
        });

        // Input enter key
        document.getElementById('adminChatInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserInput();
            }
        });
    }

    sendWelcomeMessage() {
        const welcomeMessage = {
            type: 'assistant',
            content: `👋 **Welcome, Admin!**

I'm your AI assistant for managing BravesGadget LLC. I can help you with:

• 📦 **Product Management** - Add, edit, search products
• 🛒 **Order Management** - Track, update order status
• 📊 **Analytics** - Revenue, trends, insights
• 📧 **Customer Support** - Contact submissions, newsletter
• ⚡ **Quick Actions** - Bulk operations, reports

**Try saying:**
- "Show me pending orders"
- "What's today's revenue?"
- "Add a new product"
- "Show low stock products"

How can I help you today?`,
            timestamp: new Date().toISOString()
        };

        this.conversationHistory.push(welcomeMessage);
        this.renderMessage(welcomeMessage);

        // Show badge if window is closed
        if (!document.getElementById('adminAiChatWindow').classList.contains('active')) {
            document.getElementById('adminChatBadge').style.display = 'flex';
        }
    }

    async handleUserInput() {
        const input = document.getElementById('adminChatInput');
        const message = input.value.trim();

        if (!message) return;

        // Add user message
        const userMessage = {
            type: 'user',
            content: message,
            timestamp: new Date().toISOString()
        };

        this.conversationHistory.push(userMessage);
        this.renderMessage(userMessage);
        this.saveConversationHistory();

        // Clear input
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Process message
        await this.processMessage(message);

        // Hide typing indicator
        this.hideTypingIndicator();
    }

    async processMessage(message) {
        const lowerMessage = message.toLowerCase();

        try {
            // Intent recognition

            // Greetings
            if (this.matchesIntent(lowerMessage, ['hello', 'hi', 'hey', 'good morning', 'good afternoon'])) {
                return this.handleGreeting();
            }

            // Dashboard & Stats
            if (this.matchesIntent(lowerMessage, ['dashboard', 'stats', 'statistics', 'overview', 'summary'])) {
                return await this.handleDashboardStats();
            }

            // Revenue & Analytics
            if (this.matchesIntent(lowerMessage, ['revenue', 'sales', 'earnings', 'income', 'money', 'profit'])) {
                return await this.handleRevenueAnalytics(lowerMessage);
            }

            // Product Management
            if (this.matchesIntent(lowerMessage, ['product', 'products', 'inventory', 'stock', 'catalog'])) {
                return await this.handleProductManagement(lowerMessage);
            }

            // Order Management
            if (this.matchesIntent(lowerMessage, ['order', 'orders', 'purchase', 'purchases'])) {
                return await this.handleOrderManagement(lowerMessage);
            }

            // Customer & Contact
            if (this.matchesIntent(lowerMessage, ['contact', 'contacts', 'customer', 'customers', 'submission'])) {
                return await this.handleCustomerSupport(lowerMessage);
            }

            // Newsletter
            if (this.matchesIntent(lowerMessage, ['newsletter', 'subscriber', 'subscribers', 'subscription'])) {
                return await this.handleNewsletter(lowerMessage);
            }

            // Bulk Operations
            if (this.matchesIntent(lowerMessage, ['bulk', 'all', 'multiple', 'batch'])) {
                return await this.handleBulkOperations(lowerMessage);
            }

            // Export & Reports
            if (this.matchesIntent(lowerMessage, ['export', 'download', 'report', 'csv'])) {
                return this.handleExport(lowerMessage);
            }

            // Help
            if (this.matchesIntent(lowerMessage, ['help', 'what can you do', 'how', 'guide', 'tutorial'])) {
                return this.handleHelp();
            }

            // Default fallback
            return this.handleFallback(message);

        } catch (error) {
            window.BRAVESGADGET_CONFIG?.logger.error('Error processing admin message:', error);
            return this.sendAssistantMessage('Sorry, I encountered an error. Please try again or contact support.');
        }
    }

    matchesIntent(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    // ========================================
    // INTENT HANDLERS
    // ========================================

    handleGreeting() {
        const greetings = [
            "Hello! Ready to manage your store. What would you like to do?",
            "Hi there! How can I assist with the admin panel today?",
            "Hey! I'm here to help with products, orders, and more. What do you need?"
        ];
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];

        this.sendAssistantMessage(greeting, [
            { label: '📊 Show Dashboard', action: 'stats' },
            { label: '🛒 View Orders', action: 'orders' },
            { label: '📦 Manage Products', action: 'products' }
        ]);
    }

    async handleDashboardStats() {
        const stats = await this.getDashboardStats();

        const message = `📊 **Dashboard Overview**

**Products**: ${stats.totalProducts} total
**Orders**: ${stats.totalOrders} (${stats.pendingOrders} pending)
**Revenue**: $${stats.totalRevenue.toFixed(2)}
**Contacts**: ${stats.totalContacts} submissions
**Newsletter**: ${stats.totalSubscribers} subscribers

**Recent Activity**:
${stats.recentOrders.map(order => `• Order #${order.order_number} - $${order.total_amount} (${order.status})`).join('\n') || '• No recent orders'}`;

        this.sendAssistantMessage(message, [
            { label: '🛒 View All Orders', action: () => showTab('orders') },
            { label: '📦 Manage Products', action: () => showTab('products') },
            { label: '📊 Refresh Stats', action: () => window.adminAI.handleDashboardStats() }
        ]);
    }

    async handleRevenueAnalytics(message) {
        const stats = await this.getDashboardStats();

        let responseMessage = `💰 **Revenue Analytics**\n\n`;

        if (message.includes('today')) {
            const todayRevenue = this.calculateTodayRevenue(allOrders);
            responseMessage += `**Today's Revenue**: $${todayRevenue.toFixed(2)}\n`;
        } else if (message.includes('week')) {
            const weekRevenue = this.calculateWeekRevenue(allOrders);
            responseMessage += `**This Week's Revenue**: $${weekRevenue.toFixed(2)}\n`;
        } else {
            responseMessage += `**Total Revenue**: $${stats.totalRevenue.toFixed(2)}\n`;
            responseMessage += `**Total Orders**: ${stats.totalOrders}\n`;
            responseMessage += `**Average Order Value**: $${(stats.totalRevenue / (stats.totalOrders || 1)).toFixed(2)}\n\n`;
            responseMessage += `**By Status**:\n`;
            responseMessage += `• Pending: ${stats.pendingOrders} orders\n`;
            responseMessage += `• Processing: ${stats.processingOrders} orders\n`;
            responseMessage += `• Shipped: ${stats.shippedOrders} orders\n`;
            responseMessage += `• Delivered: ${stats.deliveredOrders} orders\n`;
        }

        this.sendAssistantMessage(responseMessage, [
            { label: '🛒 View Orders', action: () => showTab('orders') },
            { label: '📊 Full Dashboard', action: () => showTab('dashboard') }
        ]);
    }

    async handleProductManagement(message) {
        // Add new product
        if (this.matchesIntent(message, ['add', 'new', 'create'])) {
            this.sendAssistantMessage(
                "I'll help you add a new product. Click the button below to open the product form.",
                [{ label: '➕ Add New Product', action: () => openAddProductModal() }]
            );
            return;
        }

        // Low stock
        if (this.matchesIntent(message, ['low stock', 'out of stock', 'stock alert'])) {
            const lowStockProducts = allProducts.filter(p => p.stock_quantity < 10);

            if (lowStockProducts.length === 0) {
                this.sendAssistantMessage("✅ Great news! All products have sufficient stock.");
                return;
            }

            let responseMessage = `⚠️ **Low Stock Alert** (${lowStockProducts.length} products)\n\n`;
            lowStockProducts.slice(0, 5).forEach(product => {
                responseMessage += `• **${product.name}** - ${product.stock_quantity} left\n`;
            });

            if (lowStockProducts.length > 5) {
                responseMessage += `\n...and ${lowStockProducts.length - 5} more`;
            }

            this.sendAssistantMessage(responseMessage, [
                { label: '📦 View All Products', action: () => showTab('products') }
            ]);
            return;
        }

        // Search product
        if (this.matchesIntent(message, ['find', 'search', 'show', 'view'])) {
            const category = this.extractCategory(message);

            if (category) {
                const categoryProducts = allProducts.filter(p => p.category_slug === category);

                let responseMessage = `📦 **${category.charAt(0).toUpperCase() + category.slice(1)} Products** (${categoryProducts.length} found)\n\n`;
                categoryProducts.slice(0, 5).forEach(product => {
                    responseMessage += `• **${product.name}** - $${product.price} (Stock: ${product.stock_quantity})\n`;
                });

                this.sendAssistantMessage(responseMessage, [
                    { label: '📦 View All', action: () => {
                        showTab('products');
                        document.getElementById('categoryFilter').value = category;
                        filterProducts();
                    }}
                ]);
                return;
            }
        }

        // Default product help
        this.sendAssistantMessage(
            `📦 **Product Management**\n\nI can help you:\n• Add new products\n• Check low stock items\n• Search by category\n• View product details\n\n**Try:**\n- "Add a new product"\n- "Show low stock products"\n- "Show me iPhones"`,
            [
                { label: '➕ Add Product', action: () => openAddProductModal() },
                { label: '⚠️ Low Stock', action: () => window.adminAI.handleProductManagement('low stock') },
                { label: '📦 All Products', action: () => showTab('products') }
            ]
        );
    }

    async handleOrderManagement(message) {
        // Pending orders
        if (this.matchesIntent(message, ['pending', 'new orders', 'unprocessed'])) {
            const pendingOrders = allOrders.filter(o => o.status === 'pending');

            if (pendingOrders.length === 0) {
                this.sendAssistantMessage("✅ No pending orders at the moment!");
                return;
            }

            let responseMessage = `🛒 **Pending Orders** (${pendingOrders.length} total)\n\n`;
            pendingOrders.slice(0, 5).forEach(order => {
                responseMessage += `• Order #${order.order_number}\n  ${order.customer_name} - $${order.total_amount}\n`;
            });

            this.sendAssistantMessage(responseMessage, [
                { label: '🛒 View All Orders', action: () => showTab('orders') },
                { label: '✅ Process Orders', action: () => {
                    showTab('orders');
                    document.getElementById('statusFilter').value = 'pending';
                    filterOrders();
                }}
            ]);
            return;
        }

        // Recent orders
        if (this.matchesIntent(message, ['recent', 'latest', 'new'])) {
            const recentOrders = allOrders.slice(0, 5);

            let responseMessage = `🛒 **Recent Orders** (${recentOrders.length} shown)\n\n`;
            recentOrders.forEach(order => {
                responseMessage += `• #${order.order_number} - ${order.customer_name}\n  $${order.total_amount} (${order.status})\n`;
            });

            this.sendAssistantMessage(responseMessage, [
                { label: '🛒 All Orders', action: () => showTab('orders') }
            ]);
            return;
        }

        // Order count
        if (this.matchesIntent(message, ['how many', 'count', 'total'])) {
            const stats = await this.getDashboardStats();
            this.sendAssistantMessage(
                `🛒 **Order Statistics**\n\n**Total Orders**: ${stats.totalOrders}\n**Pending**: ${stats.pendingOrders}\n**Processing**: ${stats.processingOrders}\n**Shipped**: ${stats.shippedOrders}\n**Delivered**: ${stats.deliveredOrders}`,
                [{ label: '🛒 View Orders', action: () => showTab('orders') }]
            );
            return;
        }

        // Default order help
        this.sendAssistantMessage(
            `🛒 **Order Management**\n\nI can help you:\n• View pending orders\n• Check order status\n• Update order details\n• View recent orders\n\n**Try:**\n- "Show pending orders"\n- "How many orders today?"\n- "View recent orders"`,
            [
                { label: '🛒 All Orders', action: () => showTab('orders') },
                { label: '⏳ Pending', action: () => window.adminAI.handleOrderManagement('pending') }
            ]
        );
    }

    async handleCustomerSupport(message) {
        const stats = await this.getDashboardStats();

        if (this.matchesIntent(message, ['new', 'unread', 'pending'])) {
            const newContacts = allContacts.filter(c => c.status === 'new');

            let responseMessage = `📧 **New Contact Submissions** (${newContacts.length} total)\n\n`;
            if (newContacts.length === 0) {
                responseMessage = "✅ No new contact submissions!";
            } else {
                newContacts.slice(0, 3).forEach(contact => {
                    responseMessage += `• **${contact.name}** - ${contact.subject}\n  ${contact.message.substring(0, 50)}...\n\n`;
                });
            }

            this.sendAssistantMessage(responseMessage, [
                { label: '📧 View All Contacts', action: () => showTab('contacts') }
            ]);
            return;
        }

        this.sendAssistantMessage(
            `📧 **Customer Support**\n\n**Total Contacts**: ${stats.totalContacts}\n\nI can help you manage contact submissions and customer inquiries.`,
            [{ label: '📧 View Contacts', action: () => showTab('contacts') }]
        );
    }

    async handleNewsletter(message) {
        const stats = await this.getDashboardStats();

        if (this.matchesIntent(message, ['export', 'download', 'csv'])) {
            this.sendAssistantMessage(
                `📰 **Newsletter Export**\n\n**Total Subscribers**: ${stats.totalSubscribers}\n\nClick below to export all subscribers to CSV.`,
                [{ label: '⬇️ Export CSV', action: () => exportSubscribers() }]
            );
            return;
        }

        this.sendAssistantMessage(
            `📰 **Newsletter Subscribers**\n\n**Total**: ${stats.totalSubscribers} subscribers\n\nManage your newsletter subscriber list and export data.`,
            [
                { label: '📰 View Subscribers', action: () => showTab('newsletter') },
                { label: '⬇️ Export CSV', action: () => exportSubscribers() }
            ]
        );
    }

    handleBulkOperations(message) {
        this.sendAssistantMessage(
            `⚡ **Bulk Operations**\n\nBulk operations should be used carefully. What would you like to do?\n\n**Available:**\n• Export newsletter subscribers\n• Filter products/orders\n• Update multiple statuses\n\n⚠️ Always backup before bulk changes!`,
            [
                { label: '📊 Dashboard', action: () => showTab('dashboard') }
            ]
        );
    }

    handleExport(message) {
        if (this.matchesIntent(message, ['newsletter', 'subscriber'])) {
            this.sendAssistantMessage(
                "📰 Exporting newsletter subscribers...",
                [{ label: '⬇️ Export Now', action: () => exportSubscribers() }]
            );
            return;
        }

        this.sendAssistantMessage(
            `⬇️ **Export Options**\n\n• Newsletter subscribers (CSV)\n• Order reports (coming soon)\n• Product catalog (coming soon)`,
            [{ label: '📰 Export Subscribers', action: () => exportSubscribers() }]
        );
    }

    handleHelp() {
        this.sendAssistantMessage(
            `❓ **Admin AI Assistant Help**\n\n**I can help with:**\n\n📦 **Products**: Add, edit, search, check stock\n🛒 **Orders**: View, update, filter by status\n📊 **Analytics**: Revenue, trends, insights\n📧 **Support**: Contact submissions\n📰 **Newsletter**: Subscriber management\n⚡ **Quick Actions**: Fast operations\n\n**Example Commands:**\n• "Show me pending orders"\n• "What's today's revenue?"\n• "Show low stock products"\n• "How many new contacts?"\n• "Export newsletter subscribers"\n\n**Quick Actions** (bottom of chat):\nUse the quick action buttons for instant access to common tasks!`,
            [
                { label: '📊 Dashboard', action: () => showTab('dashboard') }
            ]
        );
    }

    handleFallback(message) {
        this.sendAssistantMessage(
            `I'm not sure I understand "${message}". \n\n💡 **Try asking:**\n• "Show dashboard stats"\n• "View pending orders"\n• "Check low stock products"\n• "What's the revenue?"\n• "Help" for more options`,
            [
                { label: '❓ Help', action: () => window.adminAI.handleHelp() }
            ]
        );
    }

    handleQuickAction(action) {
        switch(action) {
            case 'stats':
                this.addUserMessage('Show me dashboard stats');
                this.handleDashboardStats();
                break;
            case 'orders':
                this.addUserMessage('Show recent orders');
                this.handleOrderManagement('recent');
                break;
            case 'products':
                this.addUserMessage('Show low stock products');
                this.handleProductManagement('low stock');
                break;
            case 'help':
                this.addUserMessage('Help');
                this.handleHelp();
                break;
        }
    }

    addUserMessage(content) {
        const userMessage = {
            type: 'user',
            content: content,
            timestamp: new Date().toISOString()
        };
        this.conversationHistory.push(userMessage);
        this.renderMessage(userMessage);
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    async getDashboardStats() {
        const totalProducts = allProducts?.length || 0;
        const totalOrders = allOrders?.length || 0;
        const totalContacts = allContacts?.length || 0;
        const totalSubscribers = allSubscribers?.length || 0;

        const totalRevenue = allOrders?.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0;

        const pendingOrders = allOrders?.filter(o => o.status === 'pending').length || 0;
        const processingOrders = allOrders?.filter(o => o.status === 'processing').length || 0;
        const shippedOrders = allOrders?.filter(o => o.status === 'shipped').length || 0;
        const deliveredOrders = allOrders?.filter(o => o.status === 'delivered').length || 0;

        const recentOrders = allOrders?.slice(0, 3) || [];

        return {
            totalProducts,
            totalOrders,
            totalContacts,
            totalSubscribers,
            totalRevenue,
            pendingOrders,
            processingOrders,
            shippedOrders,
            deliveredOrders,
            recentOrders
        };
    }

    calculateTodayRevenue(orders) {
        const today = new Date().toDateString();
        return orders.filter(o => new Date(o.created_at).toDateString() === today)
            .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    }

    calculateWeekRevenue(orders) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return orders.filter(o => new Date(o.created_at) >= weekAgo)
            .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    }

    extractCategory(message) {
        const categories = ['iphone', 'samsung', 'laptop', 'desktop', 'tablet', 'smartwatch', 'starlink'];
        return categories.find(cat => message.includes(cat));
    }

    // ========================================
    // MESSAGE RENDERING
    // ========================================

    sendAssistantMessage(content, actions = []) {
        const message = {
            type: 'assistant',
            content: content,
            actions: actions,
            timestamp: new Date().toISOString()
        };

        this.conversationHistory.push(message);
        this.renderMessage(message);
        this.saveConversationHistory();

        // Execute auto-actions if specified
        if (message.executeAction) {
            setTimeout(() => this.executeAction(message.executeAction), 500);
        }
    }

    renderMessage(message) {
        const messagesContainer = document.getElementById('adminChatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${message.type}`;

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = this.formatMessageContent(message.content);

        messageDiv.appendChild(bubble);

        // Add action buttons if present
        if (message.actions && message.actions.length > 0) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';

            message.actions.forEach(action => {
                const actionBtn = document.createElement('button');
                actionBtn.className = 'action-btn';
                actionBtn.textContent = action.label;
                actionBtn.onclick = () => {
                    if (typeof action.action === 'function') {
                        action.action();
                    } else if (typeof action.action === 'string') {
                        this.handleQuickAction(action.action);
                    }
                };
                actionsDiv.appendChild(actionBtn);
            });

            messageDiv.appendChild(actionsDiv);
        }

        // Add timestamp
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageDiv.appendChild(time);

        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessageContent(content) {
        // Convert markdown-style formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/•/g, '&bull;');
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('adminChatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message assistant typing-indicator';
        typingDiv.id = 'typingIndicator';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';

        typingDiv.appendChild(bubble);
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        document.getElementById('typingIndicator')?.remove();
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('adminChatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ========================================
    // STORAGE
    // ========================================

    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('adminAiConversation');
            if (saved) {
                this.conversationHistory = JSON.parse(saved).slice(-10); // Keep last 10
                this.conversationHistory.forEach(msg => this.renderMessage(msg));
            }
        } catch (error) {
            window.BRAVESGADGET_CONFIG?.logger.error('Error loading admin conversation:', error);
        }
    }

    saveConversationHistory() {
        try {
            const toSave = this.conversationHistory.slice(-10);
            localStorage.setItem('adminAiConversation', JSON.stringify(toSave));
        } catch (error) {
            window.BRAVESGADGET_CONFIG?.logger.error('Error saving admin conversation:', error);
        }
    }
}

// Initialize Admin AI when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for admin panel data to load
    setTimeout(() => {
        window.adminAI = new BravesGadgetAdminAI();
        window.BRAVESGADGET_CONFIG?.logger.log('✅ Admin AI Assistant ready');
    }, 1000);
});
