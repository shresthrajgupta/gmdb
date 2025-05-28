import { MdHomeFilled } from "react-icons/md";
import { FaGamepad, FaCheck } from "react-icons/fa6";

export const navigation = [
    {
        label: "Home",
        href: "/home",
        icon: <MdHomeFilled />
    },
    {
        label: "Playlist",
        href: "/playlist",
        icon: <FaGamepad />
    },
    {
        label: "Completed",
        href: "/completedlist",
        icon: <FaCheck />
    }
];

export const mobileNavigation = [
    ...navigation
];