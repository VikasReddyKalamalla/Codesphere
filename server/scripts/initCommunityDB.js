/**
 * CodeSphere — Enterprise Community & WhatsApp-style Realtime DB Initialization Script
 * Run: node scripts/initCommunityDB.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Community = require('../models/Community');
const Channel = require('../models/Channel');
const DirectChat = require('../models/DirectChat');
const Message = require('../models/Message');
const User = require('../models/User');

const initCommunityDB = async () => {
  await connectDB();
  console.log('Connected to MongoDB for Enterprise Community Database Initialization...\n');

  // 1. Fetch Users
  const users = await User.find({}).limit(6);
  if (users.length === 0) {
    console.error('No users found in database! Please run `node seed.js` first.');
    process.exit(1);
  }

  const vikas = users.find((u) => u.username === 'vikasreddy') || users[0];
  const sarah = users.find((u) => u.username === 'sarahchen') || users[1] || users[0];
  const admin = users.find((u) => u.role === 'admin') || users[users.length - 1];

  console.log(`Using users: Vikas (${vikas.fullName}), Sarah (${sarah.fullName}), Admin (${admin.fullName})`);

  // 2. Fetch or create sample communities
  let communities = await Community.find({});
  if (communities.length === 0) {
    console.log('No communities found. Creating default CodeSphere communities...');
    communities = await Community.insertMany([
      {
        name: 'JavaScript & Full-Stack Developers',
        slug: 'javascript-fullstack',
        description: 'The central hub for React, Node.js, Next.js, and TypeScript developers at CodeSphere.',
        category: 'Web Development',
        owner: sarah._id,
        moderators: [vikas._id],
        members: [sarah._id, vikas._id, admin._id],
        memberCount: 3,
        inviteCode: 'JS2026',
      },
      {
        name: 'AI, Machine Learning & Python',
        slug: 'ai-ml-python',
        description: 'Explore neural networks, LLM architectures, Gemini APIs, PyTorch, and data engineering.',
        category: 'AI & Data Science',
        owner: sarah._id,
        members: [sarah._id, vikas._id],
        memberCount: 2,
        inviteCode: 'AIML26',
      },
      {
        name: 'DSA & Competitive Programming',
        slug: 'dsa-competitive',
        description: 'Daily LeetCode discussions, algorithmic patterns, FAANG interview prep, and contest debriefs.',
        category: 'Competitive Programming',
        owner: admin._id,
        moderators: [sarah._id],
        members: [admin._id, vikas._id, sarah._id],
        memberCount: 3,
        inviteCode: 'DSA400',
      },
    ]);
  }

  console.log(`Found/Initialized ${communities.length} communities.`);

  // 3. For each community, ensure enterprise channels exist
  const channelTemplates = [
    {
      name: 'announcements',
      slug: 'announcements',
      category: 'Information',
      type: 'announcement',
      topic: 'Official news, system releases, and community guidelines.',
      order: 0,
      allowedRoles: ['owner', 'admin', 'moderator'],
    },
    {
      name: 'general',
      slug: 'general',
      category: 'General',
      type: 'text',
      topic: 'Open discussions, developer networking, and collaboration.',
      order: 1,
    },
    {
      name: 'code-showcase',
      slug: 'code-showcase',
      category: 'Showcase',
      type: 'text',
      topic: 'Share your repositories, CodeSphere workspaces, and snippets with 1-click execution.',
      order: 2,
    },
    {
      name: 'help-forum',
      slug: 'help-forum',
      category: 'Support',
      type: 'forum',
      topic: 'Ask technical questions, get unstuck with errors, and discuss algorithms.',
      order: 3,
    },
    {
      name: 'random',
      slug: 'random',
      category: 'General',
      type: 'text',
      topic: 'Casual chat, tech humor, gear recommendations, and coffee breaks.',
      order: 4,
    },
  ];

  for (const comm of communities) {
    const existingChannels = await Channel.find({ community: comm._id });
    const channelIds = [];
    let defaultCh = null;

    if (existingChannels.length === 0) {
      console.log(`Creating enterprise channels for community: "${comm.name}"...`);
      for (const tpl of channelTemplates) {
        const ch = await Channel.create({
          ...tpl,
          community: comm._id,
        });
        channelIds.push(ch._id);
        if (ch.slug === 'general') defaultCh = ch._id;
      }

      await Community.findByIdAndUpdate(comm._id, {
        channels: channelIds,
        defaultChannel: defaultCh || channelIds[0],
        channelCategories: [
          { name: 'Information', order: 0 },
          { name: 'General', order: 1 },
          { name: 'Showcase', order: 2 },
          { name: 'Support', order: 3 },
        ],
      });
    } else {
      channelIds.push(...existingChannels.map((c) => c._id));
      defaultCh = existingChannels.find((c) => c.slug === 'general')?._id || existingChannels[0]._id;
      await Community.findByIdAndUpdate(comm._id, {
        channels: channelIds,
        defaultChannel: defaultCh,
      });
    }
  }

  // 4. Seed rich sample messages with code snippets and delivery receipts
  const jsCommunity = communities[0];
  const generalChannel = await Channel.findOne({ community: jsCommunity._id, slug: 'general' });
  const showcaseChannel = await Channel.findOne({ community: jsCommunity._id, slug: 'code-showcase' });

  if (generalChannel) {
    const msgCount = await Message.countDocuments({ channel: generalChannel._id });
    if (msgCount === 0) {
      console.log(`Seeding initial messages for #${generalChannel.name}...`);
      const m1 = await Message.create({
        sender: sarah._id,
        room: `channel:${generalChannel._id}`,
        channel: generalChannel._id,
        community: jsCommunity._id,
        content: `Welcome to the official **${jsCommunity.name}** channel! 🚀\nFeel free to introduce yourself, discuss architecture, and share what you are building.`,
        type: 'text',
        deliveryStatus: 'read',
        readBy: [{ user: vikas._id, readAt: new Date() }, { user: sarah._id, readAt: new Date() }],
        isPinned: true,
      });

      const m2 = await Message.create({
        sender: vikas._id,
        room: `channel:${generalChannel._id}`,
        channel: generalChannel._id,
        community: jsCommunity._id,
        content: `Hey everyone! Excited to be here. I've been experimenting with CodeSphere's real-time WebSockets and Redis Streams today. The latency is incredible!`,
        type: 'text',
        deliveryStatus: 'read',
        replyTo: m1._id,
        readBy: [{ user: sarah._id, readAt: new Date() }],
        reactions: new Map([['🔥', [sarah._id, admin._id]], ['🚀', [sarah._id]]]),
      });

      await Message.create({
        sender: sarah._id,
        room: `channel:${generalChannel._id}`,
        channel: generalChannel._id,
        community: jsCommunity._id,
        content: `That's awesome @vikasreddy! Here is a clean snippet showing how Redis adapter distributes messages across clustered WebSocket gateways:`,
        type: 'code',
        codeSnippet: {
          title: 'redisSocketGateway.js',
          language: 'javascript',
          code: `const { createAdapter } = require('@socket.io/redis-adapter');\nconst { createClient } = require('redis');\n\nconst pubClient = createClient({ url: process.env.REDIS_URL });\nconst subClient = pubClient.duplicate();\n\nPromise.all([pubClient.connect(), subClient.connect()]).then(() => {\n  io.adapter(createAdapter(pubClient, subClient));\n  console.log('⚡ Clustered WebSocket Gateway Ready!');\n});`,
        },
        deliveryStatus: 'read',
        readBy: [{ user: vikas._id, readAt: new Date() }],
        reactions: new Map([['❤️', [vikas._id]]]),
      });

      await Channel.findByIdAndUpdate(generalChannel._id, {
        messageCount: 3,
        lastMessage: {
          content: 'Here is a clean snippet showing how Redis adapter distributes messages...',
          sender: sarah._id,
          senderName: sarah.fullName,
          timestamp: new Date(),
        },
      });
    }
  }

  // 5. Seed Direct WhatsApp-style conversation
  const existingDirect = await DirectChat.findOne({
    participants: { $all: [vikas._id, sarah._id], $size: 2 },
  });

  if (!existingDirect) {
    console.log('Creating WhatsApp-style direct chat between Vikas & Sarah Chen...');
    const dm = await DirectChat.create({
      participants: [vikas._id, sarah._id],
      isGroup: false,
      unreadCounts: {
        [vikas._id.toString()]: 0,
        [sarah._id.toString()]: 0,
      },
      lastMessage: {
        content: 'Sure! Let me review your pull request in the IDE.',
        sender: sarah._id,
        senderName: sarah.fullName,
        timestamp: new Date(),
        isRead: true,
      },
    });

    const dmRoom = `direct:${dm._id}`;
    await Message.create({
      sender: vikas._id,
      room: dmRoom,
      directChat: dm._id,
      content: `Hi Sarah! Could you take a look at the community chat schema when you have a moment?`,
      type: 'text',
      deliveryStatus: 'read',
      readBy: [{ user: sarah._id, readAt: new Date() }],
    });

    await Message.create({
      sender: sarah._id,
      room: dmRoom,
      directChat: dm._id,
      content: `Sure! Let me review your pull request in the IDE. Looks very solid and clean.`,
      type: 'text',
      deliveryStatus: 'read',
      readBy: [{ user: vikas._id, readAt: new Date() }],
    });
  }

  // 6. Ensure all indexes on MongoDB
  console.log('\nEnsuring compound database indexes for enterprise throughput...');
  await Channel.syncIndexes();
  await DirectChat.syncIndexes();
  await Message.syncIndexes();
  await Community.syncIndexes();

  console.log('✓ All enterprise indexes verified and created successfully.');
  console.log('🎉 Enterprise Community Database initialization finished!\n');
  process.exit(0);
};

initCommunityDB().catch((err) => {
  console.error('Database initialization error:', err);
  process.exit(1);
});
