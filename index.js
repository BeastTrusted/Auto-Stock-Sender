// Require the necessary discord.js classes
const { Client } = require('discord.js-selfbot-v13');
const config = require('./config.json');
const { execSync } = require('child_process');

// ASCII Art
const zeta = `
                                                    ┏┓┏┳┓┏┓┏┓┓┏┓  
                                                    ┗┓ ┃ ┃┃┃ ┃┫   
                                                    ┗┛ ┻ ┗┛┗┛┛┗┛  
                                                    ┏┓┏┓┳┓┳┓┏┓┳┓  
                                                    ┗┓┣ ┃┃┃┃┣ ┣┫  
                                                    ┗┛┗┛┛┗┻┛┗┛┛┗  
                                            ══════════════════════════════════
                                        DEV : s3ll.zeta  | GITHUB : BeastTrusted
                                    ════════════════════════════════════════════════
`;

// Function to clear the terminal
const clearTerminal = () => {
    if (process.platform === 'win32') {
        // Windows
        execSync('cls', { stdio: 'inherit' });
    } else {
        // Linux/macOS
        execSync('clear', { stdio: 'inherit' });
    }
};

// Create a new client instance
const client = new Client();

// Function to send messages to all specified channels
const sendMessageToChannels = async () => {
    for (const serverId in config.channels) {
        const channelId = config.channels[serverId];
        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel) {
                console.log(`Channel ${channelId} not found in server ${serverId}`);
                continue;
            }
            await channel.send(config.message);
            
            // Fetching the server and channel names
            const server = await client.guilds.fetch(serverId);
            const serverName = server ? server.name : 'Unknown Server';
            const channelName = channel ? channel.name : 'Unknown Channel';
            const currentTime = new Date().toLocaleString();
            
            console.log(`[ Info ] Message Sent To ${channelName} IN ${serverName} | [ ${currentTime} ]`);
        } catch (error) {
            console.error(`Failed to send message to channel ${channelId} in server ${serverId}:`, error);
        }
    }
};

// When the client is ready, run this code (only once)
client.once('ready', () => {
    // Clear the terminal
    clearTerminal();

    // Display ASCII Art
    console.log(zeta);

    console.log('Logged In To Token');
    
    // Send messages at the specified interval
    const intervalMilliseconds = config.intervalMinutes * 60 * 1000;
    setInterval(sendMessageToChannels, intervalMilliseconds);
    
    // Initial call to send messages immediately upon startup
    sendMessageToChannels();
});

// Login to Discord with your app's token from config.json
client.login(config.token);
