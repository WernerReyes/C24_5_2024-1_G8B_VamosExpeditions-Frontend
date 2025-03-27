import type { UserEntity } from "@/domain/entities";
import { Avatar } from "@/presentation/components";

type Props = {
  user: UserEntity;
};

export const UserInfo = ({ user }: Props) => {
  const firstName = user.fullname.split(" ")[0];
  const lastName = user.fullname.split(" ")[1];
  return (
    <div className="flex items-center gap-2">
      <Avatar
        /* label={firstName[0]  + lastName[0]} */
        shape="circle"
        className="bg-primary text-white"
      />
      <span>{user.fullname}</span>
    </div>
  );
};
