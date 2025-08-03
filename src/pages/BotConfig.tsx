import React, { useState, useEffect } from 'react'
import { Bot, Save, Copy, Eye, EyeOff } from 'lucide-react'
import { BotConfig as BotConfigType } from '../types'

const BotConfig: React.FC = () => {
  const [config, setConfig] = useState<BotConfigType>(() => {
    const saved = localStorage.getItem('bot-config')
    return saved ? JSON.parse(saved) : {
      token: '',
      prefix: '!',
      channels: {
        sales: '',
        logs: '',
        support: ''
      },
      roles: {
        admin: '',
        moderator: '',
        customer: ''
      },
      messages: {
        welcome: 'Bem-vindo ao nosso servidor! Use !produtos para ver nossos produtos.',
        purchase_success: '✅ Compra realizada com sucesso! Você receberá o produto em breve.',
        purchase_error: '❌ Erro ao processar a compra. Tente novamente ou entre em contato com o suporte.'
      }
    }
  })
  
  const [showToken, setShowToken] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem('bot-config', JSON.stringify(config))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleInputChange = (field: string, value: string, nested?: string) => {
    if (nested) {
      setConfig(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested as keyof BotConfigType],
          [field]: value
        }
      }))
    } else {
      setConfig(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const copyBotCode = () => {
    const botCode = `
// Bot de Vendas Discord - Código Base
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const config = ${JSON.stringify(config, null, 2)};

// API Nitro Configuration
const NITRO_API = {
  endpoint: 'https://api.nitropagamentos.com/api/',
  token: 'SEU_TOKEN_AQUI' // Configure nas configurações do painel
};

client.on('ready', () => {
  console.log(\`Bot \${client.user.tag} está online!\`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'produtos':
      await showProducts(message);
      break;
    case 'comprar':
      await handlePurchase(message, args);
      break;
    case 'ajuda':
      await showHelp(message);
      break;
  }
});

async function showProducts(message) {
  try {
    const response = await axios.get(\`\${NITRO_API.endpoint}public/v1/products?api_token=\${NITRO_API.token}\`);
    const products = response.data.data || [];

    const embed = new EmbedBuilder()
      .setTitle('🛍️ Produtos Disponíveis')
      .setColor('#5865F2')
      .setTimestamp();

    if (products.length === 0) {
      embed.setDescription('Nenhum produto disponível no momento.');
    } else {
      products.forEach(product => {
        const price = (product.amount / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });
        embed.addFields({
          name: product.title,
          value: \`**Preço:** \${price}\\n**Hash:** \${product.hash}\\n**Tipo:** \${product.product_type}\`,
          inline: true
        });
      });
      embed.setFooter({ text: \`Use \${config.prefix}comprar <hash> para comprar um produto\` });
    }

    await message.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    await message.reply('❌ Erro ao carregar produtos. Tente novamente mais tarde.');
  }
}

async function handlePurchase(message, args) {
  if (args.length === 0) {
    return message.reply(\`❌ Use: \${config.prefix}comprar <hash_do_produto>\`);
  }

  const productHash = args[0];
  
  // Aqui você implementaria a lógica de compra
  // Por exemplo, criar um formulário ou link de pagamento
  
  const embed = new EmbedBuilder()
    .setTitle('💳 Iniciar Compra')
    .setDescription(\`Para comprar o produto \${productHash}, clique no link abaixo:\`)
    .setColor('#22C55E')
    .addFields({
      name: '🔗 Link de Pagamento',
      value: \`[Clique aqui para pagar](https://api.nitropagamentos.com/api/public/v1/checkout/\${productHash})\`
    })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

async function showHelp(message) {
  const embed = new EmbedBuilder()
    .setTitle('📋 Comandos Disponíveis')
    .setColor('#5865F2')
    .addFields(
      { name: \`\${config.prefix}produtos\`, value: 'Lista todos os produtos disponíveis', inline: false },
      { name: \`\${config.prefix}comprar <hash>\`, value: 'Inicia o processo de compra de um produto', inline: false },
      { name: \`\${config.prefix}ajuda\`, value: 'Mostra esta mensagem de ajuda', inline: false }
    )
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

client.login(config.token);
`;

    navigator.clipboard.writeText(botCode)
    alert('Código do bot copiado para a área de transferência!')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot className="h-8 w-8 text-discord-500" />
          <h2 className="text-2xl font-bold text-gray-900">Configuração do Bot</h2>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={copyBotCode}
            className="btn-secondary flex items-center space-x-2"
          >
            <Copy className="h-5 w-5" />
            <span>Copiar Código</span>
          </button>
          <button
            onClick={handleSave}
            className={`btn-primary flex items-center space-x-2 ${saved ? 'bg-green-600' : ''}`}
          >
            <Save className="h-5 w-5" />
            <span>{saved ? 'Salvo!' : 'Salvar'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações Básicas */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações Básicas</h3>
          
          <div className="space-y-4">
            <div>
              <label className="label">Token do Bot</label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={config.token}
                  onChange={(e) => handleInputChange('token', e.target.value)}
                  className="input-field pr-10"
                  placeholder="Token do seu bot Discord"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showToken ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Prefixo dos Comandos</label>
              <input
                type="text"
                value={config.prefix}
                onChange={(e) => handleInputChange('prefix', e.target.value)}
                className="input-field"
                placeholder="!"
              />
            </div>
          </div>
        </div>

        {/* Canais */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Canais</h3>
          
          <div className="space-y-4">
            <div>
              <label className="label">Canal de Vendas</label>
              <input
                type="text"
                value={config.channels.sales}
                onChange={(e) => handleInputChange('sales', e.target.value, 'channels')}
                className="input-field"
                placeholder="ID do canal de vendas"
              />
            </div>

            <div>
              <label className="label">Canal de Logs</label>
              <input
                type="text"
                value={config.channels.logs}
                onChange={(e) => handleInputChange('logs', e.target.value, 'channels')}
                className="input-field"
                placeholder="ID do canal de logs"
              />
            </div>

            <div>
              <label className="label">Canal de Suporte</label>
              <input
                type="text"
                value={config.channels.support}
                onChange={(e) => handleInputChange('support', e.target.value, 'channels')}
                className="input-field"
                placeholder="ID do canal de suporte"
              />
            </div>
          </div>
        </div>

        {/* Cargos */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cargos</h3>
          
          <div className="space-y-4">
            <div>
              <label className="label">Cargo Admin</label>
              <input
                type="text"
                value={config.roles.admin}
                onChange={(e) => handleInputChange('admin', e.target.value, 'roles')}
                className="input-field"
                placeholder="ID do cargo de administrador"
              />
            </div>

            <div>
              <label className="label">Cargo Moderador</label>
              <input
                type="text"
                value={config.roles.moderator}
                onChange={(e) => handleInputChange('moderator', e.target.value, 'roles')}
                className="input-field"
                placeholder="ID do cargo de moderador"
              />
            </div>

            <div>
              <label className="label">Cargo Cliente</label>
              <input
                type="text"
                value={config.roles.customer}
                onChange={(e) => handleInputChange('customer', e.target.value, 'roles')}
                className="input-field"
                placeholder="ID do cargo de cliente"
              />
            </div>
          </div>
        </div>

        {/* Mensagens */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mensagens</h3>
          
          <div className="space-y-4">
            <div>
              <label className="label">Mensagem de Boas-vindas</label>
              <textarea
                value={config.messages.welcome}
                onChange={(e) => handleInputChange('welcome', e.target.value, 'messages')}
                className="input-field"
                rows={3}
                placeholder="Mensagem enviada quando alguém entra no servidor"
              />
            </div>

            <div>
              <label className="label">Mensagem de Compra Bem-sucedida</label>
              <textarea
                value={config.messages.purchase_success}
                onChange={(e) => handleInputChange('purchase_success', e.target.value, 'messages')}
                className="input-field"
                rows={2}
                placeholder="Mensagem enviada quando uma compra é realizada"
              />
            </div>

            <div>
              <label className="label">Mensagem de Erro na Compra</label>
              <textarea
                value={config.messages.purchase_error}
                onChange={(e) => handleInputChange('purchase_error', e.target.value, 'messages')}
                className="input-field"
                rows={2}
                placeholder="Mensagem enviada quando há erro na compra"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-medium text-blue-900 mb-4">📋 Instruções de Instalação</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>1.</strong> Crie um bot no Discord Developer Portal</p>
          <p><strong>2.</strong> Copie o token do bot e cole no campo acima</p>
          <p><strong>3.</strong> Configure os IDs dos canais e cargos do seu servidor</p>
          <p><strong>4.</strong> Clique em "Copiar Código" para obter o código do bot</p>
          <p><strong>5.</strong> Instale as dependências: <code className="bg-blue-100 px-1 rounded">npm install discord.js axios</code></p>
          <p><strong>6.</strong> Execute o bot: <code className="bg-blue-100 px-1 rounded">node bot.js</code></p>
        </div>
      </div>
    </div>
  )
}

export default BotConfig