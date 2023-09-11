import { sql } from '@vercel/postgres';
/** import { type Adapter } from "@auth/core/adapters" */

import { Adapter } from "@auth/core/adapters"


export default function MyAdapter(client, options = {}) {
  return {
    async createUser(user) {
      let { rows, fields } = await sql`INSERT INTO user ("adapter_id", "name", "email", "email_verified") VALUES (${user.id}, ${user.name}, ${user.email}, ${user.emailVerified}) RETURNING *`;
      return rows, fields
    },

    async getUser(id) {
      let { rows, fields } = await sql`SELECT * from user WHERE adapter_id=${id}`;
      return rows, fields
    },
    async getUserByEmail(email) {
      let { rows, fields } = await sql`SELECT * from user WHERE email=${email}`;
      return rows, fields
    },
    async getUserByAccount({ providerAccountId, provider }) {
      return
    },
    async updateUser(user) {
      return
    },
    async deleteUser(userId) {
      return
    },
    async linkAccount(account) {
      return
    },
    async unlinkAccount({ providerAccountId, provider }) {
      return
    },
    async createSession({ sessionToken, userId, expires }) {
      return
    },
    async getSessionAndUser(sessionToken) {
      return
    },
    async updateSession({ sessionToken }) {
      return
    },
    async deleteSession(sessionToken) {
      return
    },
    async createVerificationToken({ identifier, expires, token }) {
      return
    },
    async useVerificationToken({ identifier, token }) {
      return
    },
  }
}