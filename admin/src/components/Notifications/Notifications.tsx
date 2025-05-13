"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";

import { hideNotification } from "@/redux/notification/notificationActions";
import { RootState } from "@/redux/rootReducer";
import { AppDispatch } from "@/redux/store";
import SingleNotification from "./SingleNotification";

type NotificationsProps = ConnectedProps<typeof connector>;

type TimeoutEntry = {
  id: number | string;
  timeoutId: ReturnType<typeof setTimeout>;
};

const Notifications = ({ notifications, hideNotification }: NotificationsProps) => {
  const visible = [...notifications].slice(-3);
  const [timeouts, setTimeouts] = useState<TimeoutEntry[]>([]);

  useEffect(() => {
    notifications.forEach((notification) => {
      const exists = timeouts.some((item) => item.id === notification.id);

      if (!exists) {
        const timeoutId = setTimeout(() => {
          hideNotification(notification.id as number);

          setTimeouts((prev) =>
            prev.filter((item) => item.id !== notification.id)
          );
        }, 3500);

        setTimeouts((prev) => [...prev, { id: notification.id!, timeoutId }]);
      }
    });

    // Cleanup on unmount (optional but recommended)
    return () => {
      timeouts.forEach((item) => clearTimeout(item.timeoutId));
    };
  }, [notifications, hideNotification, timeouts]);


  return (
    <div className="fixed right-10 bottom-10 z-50 w-[350px] group flex flex-col items-end  space-y-[-62px] hover:space-y-3 transition-all duration-300">
      <AnimatePresence initial={false} mode="popLayout">
        {visible.map((notification) => {

          return (
            <motion.div
              key={notification.id}
              layout="position"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`w-full `}
            >
              <SingleNotification
                notification={notification}
                onClose={hideNotification}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  notifications: state.notification.notifications,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  hideNotification: (id: number) => dispatch(hideNotification(id)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(Notifications);
