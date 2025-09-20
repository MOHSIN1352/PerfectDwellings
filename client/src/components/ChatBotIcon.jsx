import React from "react";
import { FaRobot } from "react-icons/fa";

export default function ChatBotIcon({ onClick }){
    return(
        <button
            onClick={onClick}
            className="fixed bottom-8 right-8 bg-slate-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-800 transition-all duration-300 z-50"
            aria-label="AI chat assistant"
        >
            <FaRobot size={30}/>

        </button>
    );
}