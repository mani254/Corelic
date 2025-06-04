"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { hideNotification } from "@/redux/notification/notificationActions";
import { RootState } from "@/redux/rootReducer";
import { AppDispatch } from "@/redux/store";
import SingleNotification from "./SingleNotification";

type TimeoutEntry = {
  id: number | string;
  timeoutId: ReturnType<typeof setTimeout>;
};

const Notifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(
    (state: RootState) => state.notification.notifications
  );
  const visible = [...notifications].slice(-3);
  const [timeouts, setTimeouts] = useState<TimeoutEntry[]>([]);

  useEffect(() => {
    notifications.forEach((notification) => {
      const exists = timeouts.some((item) => item.id === notification.id);
      if (!exists) {
        const timeoutId = setTimeout(() => {
          dispatch(hideNotification(notification.id as number));
          setTimeouts((prev) =>
            prev.filter((item) => item.id !== notification.id)
          );
        }, 3500);
        setTimeouts((prev) => [...prev, { id: notification.id!, timeoutId }]);
      }
    });

    return () => {
      timeouts.forEach((item) => clearTimeout(item.timeoutId));
    };
  }, [notifications, dispatch, timeouts]);

  return (
    <div className="fixed right-10 bottom-10 z-[9999] w-[350px] group flex flex-col items-end  space-y-[-62px] hover:space-y-3 transition-all duration-300">
      <AnimatePresence initial={false} mode="popLayout">
        {visible.map((notification) => (
          <motion.div
            key={notification.id}
            layout="position"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="w-full"
          >
            <SingleNotification
              notification={notification}
              onClose={(id) => dispatch(hideNotification(id))}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
