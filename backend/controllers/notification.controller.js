import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const allNotifications = await Notification.find({
            to: userId,
        }).populate({
            path: "from",
            select: "username profileImg",
        });

        await Notification.updateMany({ to: userId }, { read: true });

        return res.status(200).json({
            success: true,
            data: allNotifications,
        });
    } catch (error) {
        console.error(`Error in getNotifications controller ${error.message}`);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({ to: userId });

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });
    } catch (error) {
        console.error(
            `Error in deleteNotifications controller ${error.message}`,
        );

        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};




//optional controller

// export const deleteOneNotification = async (req, res) => {
//     const notificationId = req.params.id;
//     const userId = req.user._id;
//     try {
//         const notification = await Notification.findById(notificationId);

//         if (!notification) {
//             return res.status(404).json({
//                 success: false,
//                 error: "Notification not found",
//             });
//         }

//         if (notification.to.toString() !== userId.toString()) {
//             return res.status(403).json({
//                 success: false,
//                 error: "You are unauthorize to delete the notification",
//             });
//         }

//         await Notification.findByIdAndDelete(notificationId);
//         return res.status(200).json({
//             success: true,
//             message: "Notification deleted successfully",
//         });
//     } catch (error) {
//         console.error(
//             `Error in deleteOneNotification controller ${error.message}`,
//         );

//         return res.status(500).json({
//             success: false,
//             error: "Internal Server Error",
//         });
//     }
// };
