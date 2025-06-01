import type { UserEntity } from "@/domain/entities";
import { Avatar } from "@/presentation/components";

type Props = {
  user: UserEntity;
  extraInfo?: keyof UserEntity; // Automatically includes all UserEntity properties
};

export const UserInfo = ({ user, extraInfo }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar
        label={user.fullname}
        shape="circle"
        badge={{
          severity: user.online ? "success" : "danger",
        }}
        className="bg-primary text-white"
      />
      <div className="flex flex-col items-center">
        <span>{user.fullname}</span>
        {extraInfo && <span>{String(user[extraInfo])}</span>}
      </div>
    </div>
  );
};
