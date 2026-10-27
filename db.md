# CodeSphere Enterprise Community & Messaging Database Schema (`db.md`)

This document contains the complete MongoDB database creation script, collection schemas, JSON validation rules, high-throughput compound indexes, and Redis data structure specifications required to initialize the enterprise real-time community and WhatsApp-style messaging engine.

---

## 1. Quick Database Initialization

To immediately initialize or reset the database with all collections, schemas, indexes, and test records, run the automated initialization script from the `server/` directory:

```bash
cd server
node scripts/initCommunityDB.js
```

---

## 2. Complete `mongosh` Database Creation Script

Copy and run the following script directly in the **`mongosh`** shell or MongoDB Compass Script Console to configure the database from scratch:

```javascript
// Connect or switch to codesphere database
use codesphere;

// ─── 1. Communities Collection ──────────────────────────────────────────────
db.createCollection("communities", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "owner"],
      properties: {
        name: {
          bsonType: "string",
          maxLength: 100,
          description: "Unique name of the community - required"
        },
        slug: {
          bsonType: "string",
          description: "URL-friendly slug"
        },
        description: {
          bsonType: "string",
          maxLength: 1000
        },
        category: {
          bsonType: "string"
        },
        rules: {
          bsonType: "string",
          maxLength: 2000
        },
        logo: { bsonType: "string" },
        banner: { bsonType: "string" },
        owner: {
          bsonType: "objectId",
          description: "User ID of the community owner - required"
        },
        moderators: {
          bsonType: "array",
          items: { bsonType: "objectId" }
        },
        members: {
          bsonType: "array",
          items: { bsonType: "objectId" }
        },
        channels: {
          bsonType: "array",
          items: { bsonType: "objectId" }
        },
        defaultChannel: {
          bsonType: "objectId"
        },
        inviteCode: {
          bsonType: "string"
        },
        visibility: {
          enum: ["public", "private"]
        },
        status: {
          enum: ["active", "archived"]
        },
        memberCount: { bsonType: "int" },
        postCount: { bsonType: "int" },
        messageCount: { bsonType: "int" }
      }
    }
  }
});

// Indexes for communities
db.communities.createIndex({ name: "text", description: "text", tags: "text" });
db.communities.createIndex({ category: 1 });
db.communities.createIndex({ owner: 1 });
db.communities.createIndex({ inviteCode: 1 }, { unique: true, sparse: true });
db.communities.createIndex({ createdAt: -1 });

// ─── 2. Channels Collection ─────────────────────────────────────────────────
db.createCollection("channels", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["community", "name"],
      properties: {
        community: {
          bsonType: "objectId",
          description: "Parent community reference - required"
        },
        name: {
          bsonType: "string",
          maxLength: 100,
          description: "Channel name (e.g. general, announcements) - required"
        },
        slug: { bsonType: "string" },
        category: {
          bsonType: "string",
          description: "Category group (Information, General, Showcase, Support)"
        },
        type: {
          enum: ["text", "announcement", "forum", "voice"],
          description: "Channel type"
        },
        topic: {
          bsonType: "string",
          maxLength: 500
        },
        isPrivate: { bsonType: "bool" },
        allowedRoles: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        slowModeSeconds: { bsonType: "int" },
        order: { bsonType: "int" },
        messageCount: { bsonType: "int" },
        lastMessage: {
          bsonType: "object",
          properties: {
            content: { bsonType: "string" },
            sender: { bsonType: "objectId" },
            senderName: { bsonType: "string" },
            timestamp: { bsonType: "date" }
          }
        }
      }
    }
  }
});

// Compound & unique indexes for channels
db.channels.createIndex({ community: 1, name: 1 }, { unique: true });
db.channels.createIndex({ community: 1, category: 1, order: 1 });
db.channels.createIndex({ community: 1, createdAt: 1 });

// ─── 3. DirectChats Collection (WhatsApp 1-on-1 & Groups) ───────────────────
db.createCollection("directchats", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["participants"],
      properties: {
        participants: {
          bsonType: "array",
          minItems: 2,
          items: { bsonType: "objectId" },
          description: "Array of participant user IDs - required"
        },
        isGroup: { bsonType: "bool" },
        groupName: { bsonType: "string", maxLength: 100 },
        groupAvatar: { bsonType: "string" },
        groupAdmin: { bsonType: "objectId" },
        lastMessage: {
          bsonType: "object",
          properties: {
            content: { bsonType: "string" },
            sender: { bsonType: "objectId" },
            senderName: { bsonType: "string" },
            timestamp: { bsonType: "date" },
            isRead: { bsonType: "bool" }
          }
        },
        unreadCounts: { bsonType: "object" },
        mutedBy: {
          bsonType: "array",
          items: { bsonType: "objectId" }
        }
      }
    }
  }
});

// Indexes for direct chats
db.directchats.createIndex({ participants: 1 });
db.directchats.createIndex({ updatedAt: -1 });

// ─── 4. Messages Collection (High-Concurrency Realtime Engine) ──────────────
db.createCollection("messages", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sender", "room", "content"],
      properties: {
        sender: {
          bsonType: "objectId",
          description: "Sender user ID - required"
        },
        room: {
          bsonType: "string",
          description: "Socket.IO room key: e.g. channel:ID or direct:ID - required"
        },
        community: { bsonType: "objectId" },
        channel: { bsonType: "objectId" },
        directChat: { bsonType: "objectId" },
        content: {
          bsonType: "string",
          maxLength: 10000,
          description: "Message content or markdown - required"
        },
        type: {
          enum: ["text", "code", "image", "file", "system", "poll"]
        },
        codeSnippet: {
          bsonType: "object",
          properties: {
            language: { bsonType: "string" },
            code: { bsonType: "string" },
            title: { bsonType: "string" }
          }
        },
        attachments: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              url: { bsonType: "string" },
              name: { bsonType: "string" },
              size: { bsonType: "number" },
              mimeType: { bsonType: "string" }
            }
          }
        },
        deliveryStatus: {
          enum: ["sent", "delivered", "read"],
          description: "WhatsApp delivery status: sent (1 tick), delivered (2 ticks), read (2 blue ticks)"
        },
        deliveredTo: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              user: { bsonType: "objectId" },
              deliveredAt: { bsonType: "date" }
            }
          }
        },
        readBy: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              user: { bsonType: "objectId" },
              readAt: { bsonType: "date" }
            }
          }
        },
        mentions: {
          bsonType: "array",
          items: { bsonType: "objectId" }
        },
        reactions: { bsonType: "object" },
        starredBy: {
          bsonType: "array",
          items: { bsonType: "objectId" }
        },
        replyTo: { bsonType: "objectId" },
        isPinned: { bsonType: "bool" },
        isEdited: { bsonType: "bool" },
        editedAt: { bsonType: "date" },
        isDeleted: { bsonType: "bool" },
        deletedAt: { bsonType: "date" }
      }
    }
  }
});

// High-throughput compound indexes for cursor-based message pagination
db.messages.createIndex({ room: 1, createdAt: -1 });
db.messages.createIndex({ channel: 1, createdAt: -1 });
db.messages.createIndex({ directChat: 1, createdAt: -1 });
db.messages.createIndex({ community: 1, createdAt: -1 });
db.messages.createIndex({ sender: 1, createdAt: -1 });
db.messages.createIndex({ room: 1, isPinned: 1 });
db.messages.createIndex({ content: "text" });

// ─── 5. Presence & Ephemeral Connections Collection ─────────────────────────
db.createCollection("presences", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user"],
      properties: {
        user: { bsonType: "objectId", description: "User ID - required" },
        isOnline: { bsonType: "bool" },
        status: { enum: ["online", "away", "busy", "offline"] },
        lastActiveAt: { bsonType: "date" },
        currentRoom: { bsonType: "string" },
        socketIds: {
          bsonType: "array",
          items: { bsonType: "string" }
        }
      }
    }
  }
});

db.presences.createIndex({ user: 1 }, { unique: true });
db.presences.createIndex({ isOnline: 1, lastActiveAt: -1 });
```

---

## 3. Redis Data Structures (Ephemeral High-Concurrency Tier)

Redis operates as the ephemeral in-flight messaging and pub-sub bus alongside MongoDB. The following keyspace architecture is utilized:

| Key Pattern | Redis Type | TTL | Purpose |
| :--- | :--- | :--- | :--- |
| `socket.io-request#*` / `socket.io#*` | Streams / PubSub | N/A | Multi-instance cluster synchronization via `@socket.io/redis-adapter` |
| `presence:user:{userId}` | Hash | 60s | Ephemeral online status, active socket IDs, current room |
| `typing:{roomKey}:{userId}` | String | 3s | Ephemeral typing state (auto-expires if user stops typing) |
| `rate:messages:{userId}` | String (Counter) | 5s | Anti-spam channel rate-limiting |
| `unread:user:{userId}` | Hash | Persistent | Fast badge counters for direct chats |

---

## 4. Verification Queries

Run these queries in `mongosh` to verify data integrity:

```javascript
// 1. Verify channel counts per community
db.channels.aggregate([
  { $group: { _id: "$community", totalChannels: { $sum: 1 } } }
]);

// 2. Query recent messages in a channel with cursor pagination
db.messages.find({ room: "channel:6adee7ec0320aed54960adab", isDeleted: false })
  .sort({ createdAt: -1 })
  .limit(20);

// 3. Check WhatsApp delivery receipt statistics
db.messages.aggregate([
  { $group: { _id: "$deliveryStatus", count: { $sum: 1 } } }
]);
```
