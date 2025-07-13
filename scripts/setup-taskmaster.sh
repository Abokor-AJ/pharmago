#!/bin/bash

echo "🚀 Setting up Task Master AI for PharmaGo project..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created! Please edit it with your actual API keys."
else
    echo "✅ .env file already exists."
fi

# Check if MCP config exists
if [ ! -f .cursor/mcp.json ]; then
    echo "❌ MCP configuration not found at .cursor/mcp.json"
    echo "Please ensure the MCP config is properly set up in your IDE."
else
    echo "✅ MCP configuration found."
fi

echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your actual API keys"
echo "2. Edit .cursor/mcp.json with your actual API keys"
echo "3. Restart your IDE to load the MCP configuration"
echo "4. Run: task-master-ai init --name='PharmaGo' --description='Pharmacy management app'"
echo "5. Run: task-master-ai models --setup"
echo ""
echo "🔑 Required API keys (at least one):"
echo "   - ANTHROPIC_API_KEY (Claude)"
echo "   - OPENAI_API_KEY (GPT-4)"
echo "   - PERPLEXITY_API_KEY (Research)"
echo "   - GOOGLE_API_KEY (Gemini)"
echo "   - MISTRAL_API_KEY (Mistral)"
echo "   - OPENROUTER_API_KEY (Multiple models)"
echo "   - XAI_API_KEY (xAI Grok)"
echo "   - AZURE_OPENAI_API_KEY (Azure OpenAI)" 