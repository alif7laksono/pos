import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications, Product, Transaction, ProductCategory, User, HistoryTransaction, Report } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};


export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "product",
        path: "/product",
        element: <Product />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "transaction",
        path: "/transaction",
        element: <Transaction />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "product-category",
        path: "/product-category",
        element: <ProductCategory />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "user",
        path: "/user",
        element: <User />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "HistoryTransaction",
        path: "/history-transaction",
        element: <HistoryTransaction />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Report",
        path: "/report",
        element: <Report />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
