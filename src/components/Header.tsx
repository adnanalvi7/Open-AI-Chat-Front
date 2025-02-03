import { ActionIcon, Menu } from "@mantine/core";
import UserIcon from "../assets/UserIcon";
import NewChat from "../assets/NewChat";

function Header() {
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
          <Menu.Item
            classNames={{
              itemLabel: "!text-base !text-[#5d5d5d]",
            }}
          >
            Log in
          </Menu.Item>
          <Menu.Item
            classNames={{
              itemLabel: "!text-base !text-[#5d5d5d]",
            }}
          >
            Sign up
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

export default Header;
