import type { UserEntity } from "@/domain/entities";
import { Avatar } from "@/presentation/components";

type Props = {
  user: UserEntity;
};

export const UserInfo = ({ user }: Props) => {
  
  return (
    <div className="flex items-center gap-2">
      <Avatar
        label={user.fullname}
        shape="circle"
        className="bg-primary text-white"
      />
      <span>{user.fullname}</span>
    </div>
  );
};
