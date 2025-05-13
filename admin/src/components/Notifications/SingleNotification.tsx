import { NotificationType } from "@/redux/notification/notificationTypes";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  notification: NotificationType;
  onClose: (id: number) => void;
};

const baseClasses =
  "flex items-start justify-between p-4 rounded-md w-full border shadow-md";

const variantClasses: Record<NotificationType["type"], string> = {
  success: "bg-green-50 text-green-800 border-green-200",
  error: "bg-red-50 text-red-800 border-red-200",
  warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  default: "bg-gray-50 text-gray-800 border-gray-200",
};

export default function SingleNotification({ notification, onClose }: Props) {
  return (
    <motion.div
      layout
      className={`${baseClasses} ${variantClasses[notification.type]} h-[70px] overflow-auto hide-scrollbar relative`}
    >
      <div className="flex flex-col space-y-1">
        <p className="text-[14px] font-medium">{notification.message}</p>
        {notification.subMessage && (
          <p className="text-[12px] text-opacity-80">{notification.subMessage}</p>
        )}
      </div>
      <button
        onClick={() => onClose(notification.id as number)}
        className="ml-4 p-1 text-gray-500 hover:text-gray-700 cursor-pointer absolute top-2 right-2"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
}
