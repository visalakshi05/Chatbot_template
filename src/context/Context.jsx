import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]); // Store chat messages

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setMessages([]); // Clear chat history
    };

    const onSent = async (prompt) => {
        setLoading(true);
        setShowResult(true);

        try {
            let usedPrompt = prompt || input;
            setRecentPrompt(usedPrompt);

            // Prevent duplicate prompts
            setPrevPrompts(prev => [...new Set([...prev, usedPrompt])]);

            // Add user message to chat history
            setMessages(prev => [...prev, { sender: "user", text: usedPrompt }]);

            let response = await run(usedPrompt);

            // Format response
            let formattedResponse = response
                .split("**")
                .map((part, index) => (index % 2 === 1 ? `<b>${part}</b>` : part))
                .join("")
                .replace(/\*/g, "<br/>")
                .replace(/\n/g, "<br/>");

            // Add bot response to chat history
            setMessages(prev => [...prev, { sender: "bot", text: formattedResponse }]);

        } catch (error) {
            console.error("Error fetching response:", error);
            setMessages(prev => [...prev, { sender: "bot", text: "Error: Unable to retrieve response." }]);
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        messages,
        input,
        setInput,
        newChat
    };

    return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;
