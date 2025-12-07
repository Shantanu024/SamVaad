import { createContext, useContext, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext.jsx";
import toast from "react-hot-toast";
import { useEffect } from "react";

const ChatContext = createContext(); 

export const ChatProvider = ({children}) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedChatUser, setSelectedChatUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const {socket, axios} = useContext(AuthContext);

    // function to get all users for sidebar
    const getUsers = useCallback(async () => {
        try{
            const {data} = await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        }catch(error){
            toast.error(error.message);
        }
    }, [axios]);

    // function to get messages for selected user
    const getMessages = useCallback(async (userId) => {
        try{
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
                // Refresh users list to update unseenMessages count
                getUsers();
            }
        }catch(error){
            toast.error(error.message);
        }
    }, [axios, getUsers]);

    // function to send message to selected user
    const sendMessage = async (messageData) => {
        try{
            const {data} = await axios.post(`/api/messages/send/${selectedChatUser._id}`, messageData);
            if(data.success){
                setMessages(prevMessages => [...prevMessages, data.newMessage]);
                // socket.emit("sendMessage", data.newMessage);
            }
            else{
                toast.error(data.message);
            }   
        }catch(error){
            toast.error(error.message);
        }   
    }
       
    // function to subscribe to messages for seleected user
    const subscribeToMessages = async () => {
        if(!socket) return;

        socket.on("newMessage", (newMessage) => {
            if(selectedChatUser && newMessage.senderId === selectedChatUser._id){
                newMessage.seen = true;
                setMessages(prevMessages => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
            else{
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages, [newMessage.senderId] : 
                    prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages [newMessage.senderId] + 1 : 1
                }));
            }
        });
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if(!socket) return;
        socket.off("newMessage");
    }

    useEffect(() => {
        subscribeToMessages();
        return () => {
            unsubscribeFromMessages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, selectedChatUser]);

    const value = {
        messages,
        users,
        selectedChatUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedChatUser,
        unseenMessages,
        setUnseenMessages
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export { ChatContext };