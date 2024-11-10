import { and, eq } from "drizzle-orm";
import { db } from "..";
import { type MemberSelectModel, member } from "../schemas/member";

export function deleteMemberByUserAndRole(userId: MemberSelectModel["user_id"], roleId: MemberSelectModel["role_id"]) {
	return db.delete(member).where(and(eq(member.user_id, userId), eq(member.role_id, roleId)));
}
