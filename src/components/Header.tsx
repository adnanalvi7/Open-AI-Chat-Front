import { ActionIcon, Menu } from "@mantine/core";
import UserIcon from "../assets/UserIcon";
import NewChat from "../assets/NewChat";
import { useAuth } from "../context/Auth";
import { IconTrash } from "@tabler/icons-react";

type Props = {
  toggle: () => void;
  setAuthType: React.Dispatch<React.SetStateAction<"" | "login" | "signup">>;
};

function Header({ toggle, setAuthType }: Props) {
  const { isAuthenticated, user, logout } = useAuth();

  const handleAuthClick = (type: "login" | "signup") => {
    setAuthType(type);
    toggle();
  };

  return (
    <div className="!py-[20px] !px-8 !mb-1.5 flex items-center justify-between z-10 font-semibold ">
      <div className="flex items-center gap-0 overflow-hidden">
        <NewChat />
      </div>
      <Menu
        classNames={{
          dropdown: "absolute flex flex-col",
        }}
        shadow="md"
        width={200}
        position="bottom-end"
      >
        <Menu.Target>
          <ActionIcon
            classNames={{
              root: "!bg-gray-200 !rounded-full !p-3 !h-[40px] !w-[40px] !flex !justify-center !items-center",
            }}
            variant="filled"
            aria-label="Settings"
          >
            <UserIcon />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {isAuthenticated ? (
            <>
              <Menu.Item component="p">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.name}</span>
                  <span className="text-gray-500">{user?.email}</span>
                </div>
              </Menu.Item>
              <Menu.Item
                classNames={{
                  itemLabel: "!text-base !text-[#5d5d5d]",
                }}
                color="red"
                leftSection={<IconTrash size={14} />}
                onClick={logout}
              >
                Log out
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item
                classNames={{
                  itemLabel: "!text-base !text-[#5d5d5d]",
                }}
                onClick={() => handleAuthClick("login")}
              >
                Log in
              </Menu.Item>
              <Menu.Item
                classNames={{
                  itemLabel: "!text-base !text-[#5d5d5d]",
                }}
                onClick={() => handleAuthClick("signup")}
              >
                Sign up
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

export default Header;
