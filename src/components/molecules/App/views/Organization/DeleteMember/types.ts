import type { MemberSelectModel } from "@lib/db/schemas/member";

export type DeleteMemberProps = {
	userId: MemberSelectModel["user_id"];
	onDelete: () => void;
};
