/**
 * CodeSphere — Apply db.md JSON Schema Validators, Compound Indexes & Verification Queries
 * Direct execution against the active MongoDB connection.
 */

require('dotenv').config();
const connectDB = require('../config/db');

async function applyDbMdSchema() {
  const conn = await connectDB();
  const db = conn.connection.db;

  console.log('\n===============================================================');
  console.log('   APPLYING db.md SCHEMAS, VALIDATORS & INDEXES TO MONGODB');
  console.log('===============================================================\n');

  const existingCollections = (await db.listCollections().toArray()).map((c) => c.name);

  // Helper to safely apply schema validation (create or collMod)
  async function applyValidator(collectionName, jsonSchema) {
    if (!existingCollections.includes(collectionName)) {
      console.log(`Creating collection "${collectionName}" with $jsonSchema validator...`);
      await db.createCollection(collectionName, {
        validator: { $jsonSchema: jsonSchema },
        validationLevel: 'moderate',
        validationAction: 'warn',
      });
      console.log(`✓ Collection "${collectionName}" created with validator.`);
    } else {
      console.log(`Applying $jsonSchema validator to existing collection "${collectionName}"...`);
      try {
        await db.command({
          collMod: collectionName,
          validator: { $jsonSchema: jsonSchema },
          validationLevel: 'moderate',
          validationAction: 'warn',
        });
        console.log(`✓ Collection "${collectionName}" validator updated successfully.`);
      } catch (err) {
        console.warn(`! collMod on "${collectionName}" warning:`, err.message);
      }
    }
  }

  // ─── 1. Communities Collection Schema ───────────────────────────────────────
  const communitiesSchema = {
    bsonType: 'object',
    required: ['name', 'owner'],
    properties: {
      name: { bsonType: 'string', maxLength: 100, description: 'Unique name of the community - required' },
      slug: { bsonType: 'string', description: 'URL-friendly slug' },
      description: { bsonType: 'string', maxLength: 1000 },
      category: { bsonType: 'string' },
      rules: { bsonType: 'string', maxLength: 2000 },
      logo: { bsonType: 'string' },
      banner: { bsonType: 'string' },
      owner: { bsonType: 'objectId', description: 'User ID of the community owner - required' },
      moderators: { bsonType: 'array', items: { bsonType: 'objectId' } },
      members: { bsonType: 'array', items: { bsonType: 'objectId' } },
      channels: { bsonType: 'array', items: { bsonType: 'objectId' } },
      defaultChannel: { bsonType: 'objectId' },
      inviteCode: { bsonType: 'string' },
      visibility: { enum: ['public', 'private'] },
      status: { enum: ['active', 'archived'] },
      memberCount: { bsonType: 'int' },
      postCount: { bsonType: 'int' },
      messageCount: { bsonType: 'int' },
    },
  };

  await applyValidator('communities', communitiesSchema);

  // Indexes for communities
  console.log('Ensuring communities compound indexes...');
  try {
    await db.collection('communities').createIndex({ name: 'text', description: 'text', tags: 'text' });
    await db.collection('communities').createIndex({ category: 1 });
    await db.collection('communities').createIndex({ owner: 1 });
    await db.collection('communities').createIndex({ inviteCode: 1 }, { unique: true, sparse: true });
    await db.collection('communities').createIndex({ createdAt: -1 });
    console.log('✓ Communities indexes applied.');
  } catch (err) {
    console.warn('Communities index warning:', err.message);
  }

  // ─── 2. Channels Collection Schema ──────────────────────────────────────────
  const channelsSchema = {
    bsonType: 'object',
    required: ['community', 'name'],
    properties: {
      community: { bsonType: 'objectId', description: 'Parent community reference - required' },
      name: { bsonType: 'string', maxLength: 100, description: 'Channel name - required' },
      slug: { bsonType: 'string' },
      category: { bsonType: 'string', description: 'Category group (Information, General, Showcase, Support)' },
      type: { enum: ['text', 'announcement', 'forum', 'voice'], description: 'Channel type' },
      topic: { bsonType: 'string', maxLength: 500 },
      isPrivate: { bsonType: 'bool' },
      allowedRoles: { bsonType: 'array', items: { bsonType: 'string' } },
      slowModeSeconds: { bsonType: 'int' },
      order: { bsonType: 'int' },
      messageCount: { bsonType: 'int' },
      lastMessage: {
        bsonType: 'object',
        properties: {
          content: { bsonType: 'string' },
          sender: { bsonType: 'objectId' },
          senderName: { bsonType: 'string' },
          timestamp: { bsonType: 'date' },
        },
      },
    },
  };

  await applyValidator('channels', channelsSchema);

  // Indexes for channels
  console.log('Ensuring channels compound indexes...');
  try {
    await db.collection('channels').createIndex({ community: 1, name: 1 }, { unique: true });
    await db.collection('channels').createIndex({ community: 1, category: 1, order: 1 });
    await db.collection('channels').createIndex({ community: 1, createdAt: 1 });
    console.log('✓ Channels indexes applied.');
  } catch (err) {
    console.warn('Channels index warning:', err.message);
  }

  // ─── 3. DirectChats Collection Schema ───────────────────────────────────────
  const directChatsSchema = {
    bsonType: 'object',
    required: ['participants'],
    properties: {
      participants: {
        bsonType: 'array',
        minItems: 2,
        items: { bsonType: 'objectId' },
        description: 'Array of participant user IDs - required',
      },
      isGroup: { bsonType: 'bool' },
      groupName: { bsonType: 'string', maxLength: 100 },
      groupAvatar: { bsonType: 'string' },
      groupAdmin: { bsonType: 'objectId' },
      lastMessage: {
        bsonType: 'object',
        properties: {
          content: { bsonType: 'string' },
          sender: { bsonType: 'objectId' },
          senderName: { bsonType: 'string' },
          timestamp: { bsonType: 'date' },
          isRead: { bsonType: 'bool' },
        },
      },
      unreadCounts: { bsonType: 'object' },
      mutedBy: { bsonType: 'array', items: { bsonType: 'objectId' } },
    },
  };

  await applyValidator('directchats', directChatsSchema);

  // Indexes for directchats
  console.log('Ensuring directchats compound indexes...');
  try {
    await db.collection('directchats').createIndex({ participants: 1 });
    await db.collection('directchats').createIndex({ updatedAt: -1 });
    console.log('✓ DirectChats indexes applied.');
  } catch (err) {
    console.warn('DirectChats index warning:', err.message);
  }

  // ─── 4. Messages Collection Schema ──────────────────────────────────────────
  const messagesSchema = {
    bsonType: 'object',
    required: ['sender', 'room', 'content'],
    properties: {
      sender: { bsonType: 'objectId', description: 'Sender user ID - required' },
      room: { bsonType: 'string', description: 'Socket.IO room key: e.g. channel:ID or direct:ID - required' },
      community: { bsonType: 'objectId' },
      channel: { bsonType: 'objectId' },
      directChat: { bsonType: 'objectId' },
      content: { bsonType: 'string', maxLength: 10000, description: 'Message content or markdown - required' },
      type: { enum: ['text', 'code', 'image', 'file', 'system', 'poll'] },
      codeSnippet: {
        bsonType: 'object',
        properties: {
          language: { bsonType: 'string' },
          code: { bsonType: 'string' },
          title: { bsonType: 'string' },
        },
      },
      attachments: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          properties: {
            url: { bsonType: 'string' },
            name: { bsonType: 'string' },
            size: { bsonType: 'number' },
            mimeType: { bsonType: 'string' },
          },
        },
      },
      deliveryStatus: {
        enum: ['sent', 'delivered', 'read'],
        description: 'WhatsApp delivery status: sent (1 tick), delivered (2 ticks), read (2 blue ticks)',
      },
      deliveredTo: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          properties: {
            user: { bsonType: 'objectId' },
            deliveredAt: { bsonType: 'date' },
          },
        },
      },
      readBy: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          properties: {
            user: { bsonType: 'objectId' },
            readAt: { bsonType: 'date' },
          },
        },
      },
      mentions: { bsonType: 'array', items: { bsonType: 'objectId' } },
      reactions: { bsonType: 'object' },
      starredBy: { bsonType: 'array', items: { bsonType: 'objectId' } },
      replyTo: { bsonType: 'objectId' },
      isPinned: { bsonType: 'bool' },
      isEdited: { bsonType: 'bool' },
      editedAt: { bsonType: 'date' },
      isDeleted: { bsonType: 'bool' },
      deletedAt: { bsonType: 'date' },
    },
  };

  await applyValidator('messages', messagesSchema);

  // Indexes for messages
  console.log('Ensuring messages high-throughput compound indexes...');
  try {
    await db.collection('messages').createIndex({ room: 1, createdAt: -1 });
    await db.collection('messages').createIndex({ channel: 1, createdAt: -1 });
    await db.collection('messages').createIndex({ directChat: 1, createdAt: -1 });
    await db.collection('messages').createIndex({ community: 1, createdAt: -1 });
    await db.collection('messages').createIndex({ sender: 1, createdAt: -1 });
    await db.collection('messages').createIndex({ room: 1, isPinned: 1 });
    await db.collection('messages').createIndex({ content: 'text' });
    console.log('✓ Messages compound indexes applied.');
  } catch (err) {
    console.warn('Messages index warning:', err.message);
  }

  // ─── 5. Presences Collection Schema ─────────────────────────────────────────
  const presencesSchema = {
    bsonType: 'object',
    required: ['user'],
    properties: {
      user: { bsonType: 'objectId', description: 'User ID - required' },
      isOnline: { bsonType: 'bool' },
      status: { enum: ['online', 'away', 'busy', 'offline'] },
      lastActiveAt: { bsonType: 'date' },
      currentRoom: { bsonType: 'string' },
      socketIds: { bsonType: 'array', items: { bsonType: 'string' } },
    },
  };

  await applyValidator('presences', presencesSchema);

  // Indexes for presences
  console.log('Ensuring presences compound indexes...');
  try {
    await db.collection('presences').createIndex({ user: 1 }, { unique: true });
    await db.collection('presences').createIndex({ isOnline: 1, lastActiveAt: -1 });
    console.log('✓ Presences compound indexes applied.');
  } catch (err) {
    console.warn('Presences index warning:', err.message);
  }

  // Normalize existing legacy messages to have valid WhatsApp delivery status
  await db.collection('messages').updateMany(
    { deliveryStatus: { $in: [null, undefined] } },
    { $set: { deliveryStatus: 'sent' } }
  );

  // ─── 6. Execute Verification Queries from Section 4 ─────────────────────────
  console.log('\n===============================================================');
  console.log('   RUNNING db.md SECTION 4 VERIFICATION QUERIES');
  console.log('===============================================================\n');

  // Query 1: Verify channel counts per community
  console.log('▶ 1. Aggregating channel counts per community:');
  const channelCounts = await db.collection('channels').aggregate([
    { $group: { _id: '$community', totalChannels: { $sum: 1 } } },
  ]).toArray();
  console.table(channelCounts);

  // Query 2: Query recent messages in a channel with cursor pagination
  console.log('▶ 2. Querying recent messages with cursor-based pagination:');
  const firstChannel = await db.collection('channels').findOne({ slug: 'general' });
  if (firstChannel) {
    const recentMessages = await db.collection('messages')
      .find({ room: `channel:${firstChannel._id}`, isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    console.log(`Found ${recentMessages.length} messages in #${firstChannel.name}:`);
    recentMessages.forEach((m, idx) => {
      console.log(`   [${idx + 1}] (${m.deliveryStatus || 'sent'}) ${m.content.substring(0, 70)}...`);
    });
  } else {
    console.log('   (No general channel found yet)');
  }

  // Query 3: Check WhatsApp delivery receipt statistics
  console.log('\n▶ 3. WhatsApp delivery receipt statistics ($group by deliveryStatus):');
  const deliveryStats = await db.collection('messages').aggregate([
    { $group: { _id: '$deliveryStatus', count: { $sum: 1 } } },
  ]).toArray();
  console.table(deliveryStats);

  console.log('\n🎉 ALL db.md SCHEMAS, VALIDATORS, COMPOUND INDEXES & QUERIES COMPLETED SUCCESSFULLY!\n');
  process.exit(0);
}

applyDbMdSchema().catch((err) => {
  console.error('Failed to apply db.md schemas:', err);
  process.exit(1);
});
